// DB Tables creations
const DBTablesModel = require('../model/DBTables');

// MAIN
// Role Table
module.exports.roleTable = async(req, res, next) => {
    return DBTablesModel
        .initRoleTable()
        .then(() => {
            return res.status(201).send(`Role Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// User Table
module.exports.userTable = async(req, res, next) => {
    return DBTablesModel
        .initUserTable()
        .then(() => {
            return res.status(201).send(`User Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// PURCHASE REQUESTS
// Payment Mode Table
module.exports.paymentModeTable = async(req,res,next) => {
    return DBTablesModel
        .initPaymentModeTable()
        .then(() => {
            return res.status(201).send(`Payment Mode Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// Branch Table
module.exports.branchTable = async(req,res,next) => {
    return DBTablesModel
        .initBranchTable()
        .then(() => {
            res.status(201).send(`Branch Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// PR Status Table
module.exports.prStatusTable = async(req, res, next) => {
    return DBTablesModel
        .initPRStatusTable()
        .then(() => {
            return res.status(201).send(`Purchase Request Status Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// Purchase Request Table
module.exports.purchaseRequestTable = async(req, res, next) => {
    return DBTablesModel
        .initPurchaseRequestTable()
        .then(() => {
            return res.status(201).send(`Purchase Request Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// Item Table
module.exports.itemTable = async(req, res ,next) => {
    return DBTablesModel
        .initItemTable()
        .then(() => {
            return res.status(201).send(`Item Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// Inventory Table
module.exports.inventoryTable = async(req, res, next) => {
    return DBTablesModel
        .initInventoryTable()
        .then(() => {
            return res.status(201).send(`Inventory Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
};

// Line Item Table
module.exports.lineItemTable = async(req, res, next) => {
    return DBTablesModel
        .initlineItemTable()
        .then(() => {
            return res.status(201).send(`Line Item Table Created!`);
        })
        .catch((err) =>{
            console.log(err);
            return res.status(500).send(`Table Creation Failed`);
        });
}

// SUPPLIER DETAILS
// Suppliers
module.exports.supplierTable = (req, res, next) => {
    return DBTablesModel
        .initSupplierTable()
        .then(() => {
            return res.status(201).send(`Supplier table created!`);
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: "Failed to create Supplier table" });
        });
};

// Category
module.exports.categoryTable = (req, res, next) => {
    return DBTablesModel
        .initCategoryTable()
        .then(() => {
            return res.status(201).send(`Category table created!`);
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: "Failed to create Category table" });
        });
};

// Suppliers Category
module.exports.suppliersCategoryTable = (req, res, next) => {
    return DBTablesModel
        .initSuppliersCategoryTable()
        .then(() => {
            return res.status(201).send(`Suppliers Category table created!`);
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: "Failed to create Suppliers Category table" });
        });
};

// PURCHASE ORDERING
// Purchase Order Table

// Payament Status Table
module.exports.paymentStatusTable = (req, res, next) => {
    return DBTablesModel
    .initpaymentStatusTable()
    .then(() => {
        return res.status(201).send(`Payment Status Table Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Failed to create Payment Status Table`);
    })
}

// Purchase Status Table


// PURCHASE PLANNER
// Planner Table

// Plan view Access Table
