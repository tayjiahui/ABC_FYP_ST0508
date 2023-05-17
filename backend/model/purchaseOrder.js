const connection = require('../db');

const purchaseOrderDB = {
    //get all purchase order to display
    getAllPO: async() => {
        let sql = `SELECT purchaseRequest.prID, purchaseRequest.requestDate, (SUM(lineItem.totalUnitPrice) * 1.08) AS 'Price', 
                paymentMode.paymentMode, supplier.supplierName, 
                COALESCE(paymentStatus.paymentStatus, 'Pending') AS 'Status' 
                FROM purchaseRequest 
                INNER JOIN paymentMode ON purchaseRequest.paymentModeID = paymentMode.paymentModeID 
                INNER JOIN supplier ON purchaseRequest.supplierID = supplier.supplierID 
                LEFT JOIN lineItem ON purchaseRequest.prID = lineItem.prID 
                LEFT JOIN paymentStatus ON purchaseRequest.prStatusID = paymentStatus.paymentStatusID 
                WHERE purchaseRequest.prStatusID = 2
                GROUP BY purchaseRequest.prID;`;

        return connection.promise()
        .query(sql)
        .then((result) => {
            if(result[0] == 0) {
                return null;
            }
            else {
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });

    },

    getPObyID: async(poID) => {
        let sql = `SELECT purchaseRequest.prID, purchaseRequest.requestDate, (SUM(lineItem.totalUnitPrice) * 1.08) AS 'Price', 
                paymentMode.paymentMode, supplier.supplierName, COALESCE(paymentStatus.paymentStatus, 'pending') AS 'Status' 
                FROM  purchaseRequest INNER JOIN paymentMode ON purchaseRequest.paymentModeID = paymentMode.paymentModeID 
                INNER JOIN supplier ON purchaseRequest.supplierID = supplier.supplierID 
                LEFT JOIN lineItem ON purchaseRequest.prID = lineItem.prID 
                LEFT JOIN paymentStatus ON purchaseRequest.prStatusID = paymentStatus.paymentStatusID 
                WHERE purchaseRequest.prID = ? AND purchaseRequest.prStatusID = 2
                GROUP BY purchaseRequest.prID;`;
        
        return connection.promise()
        .query(sql, [poID])
        .then((result) => {
            if (result[0] == 0) {
                return null;
            }
            else {
                return result[0]
            }
        })
        .catch((err) => {
            console.log(err)
            throw err;
        });

    }
};

module.exports = purchaseOrderDB;