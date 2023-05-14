const connection = require('../db');

const purchaseReqDB = {
    // ===============================
    // PR
    // add PR
    addPR: async(requestDate, userID, supplierID, paymentModeID, branchID, remarks) => {
        let sql = `INSERT INTO purchaseRequest(requestDate, userID, supplierID, paymentModeID, branchID, remarks) VALUES (?,?,?,?,?,?)`;

        return connection.promise()
        .query(sql, [requestDate, userID, supplierID, paymentModeID, branchID, remarks])
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get all PR
    getAllPR: async() => {
        let sql = `SELECT PR.prID, U.name, B.branchName, S.supplierName, PR.prStatusID, PRS.prStatus
                    FROM purchaseRequest PR, user U, branch B, supplier S, prStatus PRS
                    WHERE PR.userID = U.userID
                    AND PR.branchID = B.branchID
                    AND PR.supplierID = S.supplierID
                    AND PR.prStatusID = PRS.prStatusID
                    ORDER BY prID asc`;

        return connection.promise()
        .query(sql)
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get PR by userid
    getPRByUserID: async(userID) => {
        let sql = `SELECT PR.prID, PR.userID, U.name, B.branchName, S.supplierName, PR.prStatusID, PRS.prStatus
                    FROM purchaseRequest PR, user U, branch B, supplier S, prStatus PRS
                    WHERE PR.userID = U.userID
                    AND PR.branchID = B.branchID
                    AND PR.supplierID = S.supplierID
                    AND PR.prStatusID = PRS.prStatusID
                    AND PR.userID = ?
                    ORDER BY prID asc`;

        return connection.promise()
        .query(sql, [userID])
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get PR by PR ID
    getPRByPRID: async(prID) => {
        let sql = `SELECT PR.prID, PR.requestDate, PR.userID, U.name, B.branchName, S.supplierName, PM.paymentMode, PR.remarks, PR.prStatusID, PRS.prStatus
                    FROM purchaseRequest PR, user U, branch B, supplier S, paymentMode PM, prStatus PRS
                    WHERE PR.userID = U.userID
                    AND PR.branchID = B.branchID
                    AND PR.supplierID = S.supplierID
                    AND PR.paymentModeID = PM.paymentModeID
                    AND PR.prStatusID = PRS.prStatusID
                    AND prID = ?
                    ORDER BY prID asc`;

                    // SELECT PR.prID, I.itemName, LI.quantity, I.unitPrice, LI.totalUnitPrice
                    // FROM purchaseRequest PR, item I, lineItem LI
                    // WHERE PR.prID = LI.prID
                    // AND LI.itemID = I.itemID
                    // ORDER BY LI.prID;

        return connection.promise()
        .query(sql, [prID])
        .then((result) => {
            if (result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err)
            throw err;
        });
    },

    // update PR by PR ID (Approver) ------> approver remarks?
    updatePRStatus: async(prStatusID, prID) => {
        let sql = `UPDATE purchaseRequest SET prStatusID = ? 
                    WHERE prID = ?`;

        return connection.promise()
        .query(sql,[prStatusID,prID])
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        })
    },

    // delete PR
    deletePR: async(prID) => {
        let sql = 'DELETE FROM purchaseRequest WHERE prID = ?';

        return connection.promise()
        .query(sql, [prID])
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // ===============================
    // Line Items
    // add line item
    addLineItem: async(prID, itemID, quantity, totalUnitPrice) => {
        let sql = `INSERT INTO lineItem(prID, itemID, quantity, totalUnitPrice) VALUES (?,?,?,?)`;

        return connection.promise()
        .query(sql, [prID, itemID, quantity, totalUnitPrice])
        .catch((err) => {
            console.log(err);
            throw err;
        })
    },

    // get line item by PR ID
    getLineItemByPRID: async(prID) => {
        let sql = `SELECT LI.lineItemID, LI.prID, LI.itemID, I.itemName, LI.quantity, I.unitPrice, LI.totalUnitPrice
                    FROM lineItem LI, item I
                    WHERE LI.itemID = I.itemID
                    AND LI.prID = ?
                    ORDER BY lineItemID asc`;

        return connection.promise()
        .query(sql, [prID])
        .then((result) => {
            if (result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err)
            throw err;
        });
    },

    // ===============================
    // Payment Mode
    // add payment mode
    addPaymentMode: async(paymentMode) => {
        let sql = `INSERT INTO paymentMode(paymentMode) VALUES (?)`;

        return connection.promise()
        .query(sql, [paymentMode])
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get all payment modes
    getAllPaymentMode: async() => {
        let sql = `SELECT * FROM paymentMode
                    ORDER BY paymentModeID asc`;

        return connection.promise()
        .query(sql)
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // ===============================
    // Branch
    // add branch
    addBranch: async(branchName, address) => {
        let sql = `INSERT INTO branch(branchName, address) VALUES (?,?)`;

        return connection.promise()
        .query(sql, [branchName, address])
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get all branch
    getAllBranch: async() => {
        let sql = `SELECT * FROM branch
                    ORDER BY branchID asc`;

        return connection.promise()
        .query(sql)
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get branch by id


    // ===============================
    // PR status
    // add PR status
    addPRStatusType: async(prStatus) => {
        let sql = `INSERT INTO prStatus(prStatus) VALUES (?)`;

        return connection.promise()
        .query(sql, [prStatus])
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get all PR status
    getAllPRStatusType: async() => {
        let sql = `SELECT * FROM prStatus
                    ORDER BY prStatusID asc`;

        return connection.promise()
        .query(sql)
        .then((result) => {
            if(result[0] == 0){
                return null;
            }
            else{
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get status by id 

};

module.exports = purchaseReqDB;