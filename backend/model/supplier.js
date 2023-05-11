const connection = require('../db');

const supplierDB = {

    // create category
    createCategory: async (categoryName) => {
        const sql = `INSERT INTO category (categoryName) VALUES (?)`;

        return connection.promise()
            .query(sql, [categoryName])
            .catch((err) => {
                throw err;
            })
    },

    // create supplier
    createSupplier: async (supplierName, contactPersonName, email, phoneNum, officeNum, address, webAddress, bankAccountNum) => {
        const sql = `INSERT INTO suppliers (supplierName, contactPersonName, email, phoneNum, officeNum, address, webAddress, bankAccountNum) VALUES (?,?,?,?,?,?,?,?)`;

        return connection.promise()
            .query(sql, [supplierName, contactPersonName, email, phoneNum, officeNum, address, webAddress, bankAccountNum])
            .catch((err) => {
                throw err;
            })
    },

    // create suppliers category
    createSuppliersCategory: async (fkSupplier_id, fkCategory_id) => {
        const sql = `INSERT INTO suppliersCategory (fkSupplier_id, fkCategory_id) VALUES (?,?)`;

        return connection.promise()
            .query(sql, [fkSupplier_id, fkCategory_id])
            .catch((err) => {
                throw err;
            })
    },

    // retrieve full supplier details by fkSupplier_id - done
    getFullSupplierDetailsByID: async (fkSupplier_id) => {
        const sql = `SELECT suppliers.supplierName, suppliers.contactPersonName, suppliers.email, suppliers.phoneNum, suppliers.officeNum, suppliers.address, suppliers.webAddress, suppliers.bankAccountNum,
                    GROUP_CONCAT(category.categoryName SEPARATOR ', ') AS "Category"
                    FROM ((suppliersCategory
                        INNER JOIN suppliers ON suppliersCategory.fkSupplier_id = suppliers.supplierID)
                        INNER JOIN category ON suppliersCategory.fkCategory_id = category.categoryID)
                    WHERE fkSupplier_id = ?
                    GROUP BY fkSupplier_id`;

        return connection.promise()
            .query(sql, [fkSupplier_id])
            .then((result) => {
                if (result[0] == 0) {
                    return null;
                }
                else {
                    return result[0];
                }
            })
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // retrieve all suppliers - id, name, categories (logo not included)
    getAllSuppliers: async() => {
        const sql = `SELECT suppliers.supplierID, suppliers.supplierName, GROUP_CONCAT(category.categoryName SEPARATOR ', ') AS "Category"
                    FROM ((suppliersCategory
                        INNER JOIN suppliers ON suppliersCategory.fkSupplier_id = suppliers.supplierID)
                        INNER JOIN category ON suppliersCategory.fkCategory_id = category.categoryID)
                    GROUP BY supplierID
                    ORDER BY supplierID ASC`;

        return connection.promise()
        .query(sql)
        .then((result) => {
            if (result[0] == 0) {
                return null;
            }
            else {
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            throw err;
        })
    },


    // retrieve supplier details by supplierID (categories not included)
    /*getSupplierBySupplierId: async (supplierID) => {
        const sql = `SELECT suppliers.supplierName, suppliers.contactPersonName, suppliers.email, suppliers.phoneNum, suppliers.officeNum, suppliers.address, 
                    suppliers.webAddress, suppliers.bankAccountNum
                    FROM suppliers
                    WHERE supplierID = ?`;

        return connection.promise()
            .query(sql, [supplierID])
            .then((result) => {
                if (result[0] == 0) {
                    return null;
                }
                else {
                    return result[0];
                }
            })
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },*/


};

module.exports = supplierDB;