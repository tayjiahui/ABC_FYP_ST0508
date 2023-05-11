const supplierModel = require('../model/supplier');

// create category
module.exports.createCategory = async (req, res, next) => {
    let categoryName = req.body.categoryName;

    return supplierModel
        .createCategory(categoryName)
        .then((result) => {
            return res.status(201).send(`Category created`);
        })
        .catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(422).send(`Category already exist`);
            }
            else {
                console.log(err);
                return res.sendStatus(500);
            }
        })
}

// create supplier
module.exports.createSupplier = async (req, res, next) => {
    let supplierName = req.body.supplierName;
    let contactPersonName = req.body.contactPersonName;
    let email = req.body.email;
    let phoneNum = req.body.phoneNum;
    let officeNum = req.body.officeNum;
    let address = req.body.address;
    let webAddress = req.body.webAddress;
    let bankAccountNum = req.body.bankAccountNum;

    return supplierModel
        .createSupplier(supplierName, contactPersonName, email, phoneNum, officeNum, address, webAddress, bankAccountNum)
        .then((result) => {
            return res.status(201).send(`Supplier created`);
        })
        .catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(422).send(`Supplier already exist`);
            }
            else {
                console.log(err);
                return res.sendStatus(500);
            }
        })
}

// retrieve supplier by supplierID
module.exports.getSupplierBySupplierId = async (req, res, next) => {
    let supplierID = parseInt(req.params.supplierID);

    if (isNaN(supplierID)) {
        res.status(400).send(`Enter number only`);
        return;
    };

    return supplierModel
        .getSupplierBySupplierId(supplierID)
        .then((result) => {
            if (result === null) {
                return res.send(`Supplier does not exist`)
            }
            else {
                return res.status(200).send(result);
            }
        })
        .catch((err) => {
            console.log(err);
            return res.sendStatus(500);
        })
}

// create suppliers category
module.exports.createSuppliersCategory = async (req, res, next) => {
    let fkSupplier_id = req.body.fkSupplier_id;
    let fkCategory_id = req.body.fkCategory_id;

    return supplierModel
        .createSuppliersCategory(fkSupplier_id, fkCategory_id)
        .then((result) => {
            return res.status(201).send(`Suppliers Category created`);
        })
        .catch((err) => {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(422).send(`Suppliers Category already exist`);
            }
            else {
                console.log(err);
                return res.sendStatus(500);
            }
        })
}

// retrieve supplier name by supplierID (test foreign key)
module.exports.getFullSupplierDetailsByID = async (req, res, next) => {
    let fkSupplier_id = parseInt(req.params.fkSupplier_id);

    if (isNaN(fkSupplier_id)) {
        res.status(400).send(`Enter number only`);
        return;
    };

    return supplierModel
        .getFullSupplierDetailsByID(fkSupplier_id)
        .then((result) => {
            if (result === null) {
                return res.send(`Supplier does not exist`)
            }
            else {
                return res.status(200).send(result);
            }
        })
        .catch((err) => {
            console.log(err);
            return res.sendStatus(500);
        })
}

// getAllSuppliers
module.exports.getAllSuppliers = async(req, res, next) => {
    return supplierModel
    .getAllSuppliers()
    .then((result) => {
        if (result === null) {
          return res.send("Sorry, no suppliers created");
        }
        else {
          return res.status(200).send(result);
        }  
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    })
}

// update supplier details - category not included
module.exports.updateSupplierDetails = async (req, res, next) => {
    let supplierID = parseInt(req.params.supplierID);
    let supplierName = req.body.supplierName;
    let contactPersonName = req.body.contactPersonName;
    let email = req.body.email;
    let phoneNum = req.body.phoneNum;
    let officeNum = req.body.officeNum;
    let address = req.body.address;
    let webAddress = req.body.webAddress;
    let bankAccountNum = req.body.bankAccountNum;

    if (isNaN(supplierID)) {
        res.status(400).send(`Enter numbers only!`);
        return;
    };

    return supplierModel
        .updateSupplierDetails(supplierName, contactPersonName, email, phoneNum, officeNum, address, webAddress, bankAccountNum, supplierID)
        .then((result) => {
            if (result === null) {
                return res.send(`Supplier does not exist`);
            }
            else {
                return res.status(200).send(`Supplier updated!`);
            }
        })
        .catch((err) => {
            return res.sendStatus(500);
        })
}

// delete supplier - category not included
module.exports.deleteSupplier = async (req, res, next) => {
    let supplierID = parseInt(req.params.supplierID);

    if (isNaN(supplierID)) {
        res.status(400).send(`Enter numbers only!`);
        return;
    };

    return supplierModel
        .deleteSupplier(supplierID)
        .then((result) => {
            if (result === null) {
                return res.send(`Supplier does not exist`);
            }
            else {
                return res.status(200).send(`Supplier deleted!`);
            }
        })
        .catch((err) => {
            return res.sendStatus(500);
        })
}