// DB Tables creations
const connection = require('../db');

const DBTables = {

    // MAIN
    // Role Table
    initRoleTable: async() => {
        const sql = 
        `CREATE TABLE role (
            roleID INT auto_increment,
            role VARCHAR(100) NOT NULL,
            PRIMARY KEY (roleID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // User Table
    initUserTable: async() => {
        const sql = 
        `CREATE TABLE user (
            userID INT auto_increment,
            roleID INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            PRIMARY KEY (userID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // PURCHASE REQUESTS
    // Payment Mode Table
    initPaymentModeTable: async() => {
        const sql = 
        `CREATE TABLE paymentMode (
            paymentModeID INT auto_increment,
            paymentMode VARCHAR(100) NOT NULL UNIQUE,
            PRIMARY KEY (paymentModeID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // Branch Table
    initBranchTable: async() => {
        const sql = 
        `CREATE TABLE branch (
            branchID INT auto_increment,
            branchName VARCHAR(255) NOT NULL UNIQUE,
            address VARCHAR(255) NOT NULL UNIQUE,
            PRIMARY KEY (branchID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },
    
    // PR Status Table
    initPRStatusTable: async() => {
        const sql = 
        `CREATE TABLE prStatus (
            prStatusID INT auto_increment,
            prStatus VARCHAR(100) NOT NULL UNIQUE,
            PRIMARY KEY (prStatusID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // Purchase Request Table
    initPurchaseRequestTable: async() => {
        const sql = 
        `CREATE TABLE purchaseRequest (
            prID INT auto_increment,
            requestDate VARCHAR(100) NOT NULL,
            userID INT NOT NULL,
            supplierID INT NOT NULL,
            paymentModeID INT NOT NULL,
            branchID INT NOT NULL,
            remarks VARCHAR(500),
            apprRemarks VARCHAR(500),
            prStatusID INT DEFAULT(1),
            PRIMARY KEY (prID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // Item Table
    initItemTable: async() => {
        const sql = 
        `CREATE TABLE item (
            itemID INT auto_increment,
            itemName VARCHAR(255) NOT NULL,
            description VARCHAR(500),
            supplierID INT NOT NULL,
            unitPrice DECIMAL(4,2) NOT NULL,
            PRIMARY KEY (itemID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // Inventory Table
    initInventoryTable: async() => {
        const sql = 
        `CREATE TABLE inventory (
            inventoryID INT auto_increment,
            itemID INT NOT NULL,
            inventoryQTY INT DEFAULT(0) NOT NULL,
            PRIMARY KEY (inventoryID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // Line Item Table
    initlineItemTable: async() => {
        const sql = 
        `CREATE TABLE lineItem (
            lineItemID INT auto_increment,
            prID INT NOT NULL,
            itemID INT NOT NULL,
            quantity INT NOT NULL,
            totalUnitPrice DECIMAL(4,2),
            PRIMARY KEY (lineItemID)
        )`;
        return connection.promise()
            .query(sql)
            .catch((err) => {
                console.log(err);
                throw err;
            })
    },

    // SUPPLIER DETAILS
    // Supplier
    initSupplierTable: async() => {
        const sql = 
        `CREATE TABLE supplier (
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
  
    // Category
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

    // Suppliers Category
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

    // PURCHASE ORDERING
    // Purchase Order Table

    // Payament Status Table
    initpaymentStatusTable: () => {
        const sql = `CREATE TABLE paymentStatus (
            paymentStatusID INT auto_increment,
            paymentStatus VARCHAR(255) NOT NULL UNIQUE,
            PRIMARY KEY (paymentStatusID)
        )`;
        return connection.promise()
        .query(sql)
        .catch((error) => {
            console.log(error)
            throw error;
        });
    }
    // Purchase Status Table


    // PURCHASE PLANNER
    // Planner Table

    // Plan view Access Table

};

module.exports = DBTables;