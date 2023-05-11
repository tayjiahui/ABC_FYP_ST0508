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
            requestDate DATETIME NOT NULL,
            userID INT NOT NULL,
            supplierID INT NOT NULL,
            paymentModeID INT NOT NULL,
            branchID INT NOT NULL,
            remarks VARCHAR(500),
            prStatusID INT NOT NULL,
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

    // Supplier Category


    // PURCHASE ORDERING
    // Purchase Order Table

    // Payament Status Table

    // Purchase Status Table


    // PURCHASE PLANNER
    // Planner Table

    // Plan view Access Table



};

module.exports = DBTables;