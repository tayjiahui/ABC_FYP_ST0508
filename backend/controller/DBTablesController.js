// DB Tables creations
const DBTablesModel = require('../model/DBTables');

// category
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

// suppliers
module.exports.suppliersTable = (req, res, next) => {
    return DBTablesModel
        .initSuppliersTable()
        .then(() => {
            return res.status(201).send(`Suppliers table created!`);
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: "Failed to create Suppliers table" });
        });
};

// suppliers category
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