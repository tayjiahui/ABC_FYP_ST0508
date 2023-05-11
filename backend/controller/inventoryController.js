const inventoryModel = require('../model/inventory');

// ===============================
// Inventory
// add inventory
module.exports.addInventory = async(req, res, next) => {
    let itemId = req.body.itemID;
    let inventoryQTY = req.body.inventoryQTY;

    return inventoryModel
    .addInventory(itemId, inventoryQTY)
    .then(() => {
        return res.status(201).send(`Inventory Item Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });

};

// get inventory by itemID
module.exports.getInventoryByItemID = async(req, res, next) => {
    let itemId = parseInt(req.params.id);

    if(isNaN(itemId)){
        res.status(400).send(`Item ID provided is not a number!`);
        return;
    }

    return inventoryModel
    .getInventoryByItemID(itemId)
    .then((result) => {
        if(result == null){
            res.status(404).send(`Inventrory item with ID${itemId} does not exist!`);
        }
        else{
            res.status(200).send(result);
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send(`Unknown Error`);
    });
};

// update inventory
module.exports.updateInventoryByItemID = async(req, res, next) => {
    let itemId = parseInt(req.params.id);
    let inventoryQTY = req.body.inventoryQTY;

    if (isNaN(itemId)) {
        res.status(400).send(`Item ID provided is not a number!`);
        return;
    };

    return inventoryModel
    .updateInventoryByItemID(inventoryQTY, itemId)
    .then((result) => {
        if(result.affectedRows == 0){
            res.status(404).send(`Inventory with Item ID${itemId} does not exist!`);
        }
        else{
            res.status(201).send(`Inventory Updated!`);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(`Unknown error`);
    });
};

// ===============================
// Item
// add item
module.exports.addItem = async(req, res, next) => {
    let itemName = req.body.itemName;
    let description = req.body.description;
    let supplierId = req.body.supplierID;
    let unitPrice = req.body.unitPrice;

    return inventoryModel
    .addItem(itemName, description, supplierId, unitPrice)
    .then(() => {
        return res.status(201).send(`Item Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });

};

// get all item
module.exports.getAllItem = async(req, res, next) => {
    return inventoryModel
    .getAllItem()
    .then((result) => {
        if (result == null){
            res.send(404).send(`There are no Purchase Requests Available`);
        }
        else{
            res.status(200).send(result);
        }
    });
};

// get item by itemID
module.exports.getItemByItemID = async(req, res, next) => {
    let itemId = parseInt(req.params.id);

    if(isNaN(itemId)){
        res.status(400).send(`Item ID provided is not a number!`);
        return;
    }

    return inventoryModel
    .getItemByItemID(itemId)
    .then((result) => {
        if(result == null){
            res.status(404).send(`Item with ID${itemId} does not exist!`);
        }
        else{
            res.status(200).send(result);
        }
    })
    .catch((err) => {
        console.log(err)
        res.status(500).send(`Unknown Error`);
    });
};

// update item
module.exports.updateItemByItemID = async(req, res, next) => {
    let itemId = parseInt(req.params.id);
    let itemName = req.body.itemName;
    let description = req.body.description;
    let supplierId = req.body.supplierID;
    let unitPrice = req.body.unitPrice;

    if (isNaN(itemId)) {
        res.status(400).send(`Item ID provided is not a number!`);
        return;
    };

    return inventoryModel
    .updateItemByItemID(itemName, description, supplierId, unitPrice, itemId)
    .then((result) => {
        if(result.affectedRows == 0){
            res.status(404).send(`Item #${itemId} does not exist!`);
        }
        else{
            res.status(201).send(`Item #${itemId} Updated!`);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(`Unknown error`);
    });
};