// DB Tables creations
const connection = require('../db');

const DBTables = {

    // category table
    initCategoryTable: async() => {
        const sql = 
        `CREATE TABLE category (
            categoryID INT auto_increment,
            categoryName VARCHAR(255) NOT NULL,
            PRIMARY KEY (categoryID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((error) => {
                console.log(error)
                throw error;
            });
    },

    // suppliers table
    initSuppliersTable: async() => {
        const sql = 
        `CREATE TABLE suppliers (
            supplierID INT auto_increment,
            supplierName VARCHAR(255) NOT NULL,
            contactPersonName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phoneNum VARCHAR(255) NOT NULL,
            officeNum VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            webAddress VARCHAR(255) NULL,
            bankAccountNum VARCHAR(255) NOT NULL,
            PRIMARY KEY (supplierID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((error) => {
                console.log(error)
                throw error;
            });
    },

    // suppliersCategory table
    initSuppliersCategoryTable: async() => {
        const sql = 
        `CREATE TABLE suppliersCategory (
            id INT auto_increment,
            fkSupplier_id INT NOT NULL,
            fkCategory_id INT NOT NULL,
            PRIMARY KEY (id)
        )`;
        return connection.promise()
            .query(sql)
            .catch((error) => {
                console.log(error)
                throw error;
            });
    },
};

module.exports = DBTables;