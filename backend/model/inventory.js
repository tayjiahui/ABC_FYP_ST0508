const connection = require('../db');

const inventoryDB = {
    // ===============================
    // Inventory
    // add inventory
    addInventory: async(itemID, inventoryQTY) => {
        let sql = `INSERT INTO inventory(itemID, inventoryQTY) VALUES (?,?)`;

        return connection.promise()
        .query(sql, [itemID, inventoryQTY])
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get Inventory by itemID
    getInventoryByItemID: async(itemID) => {
        let sql = `SELECT IV.itemID, I.itemName, IV.inventoryQTY
                    FROM inventory IV, item I
                    WHERE IV.itemID = I.itemID
                    AND IV.itemID = ?
                    ORDER BY itemID asc`;

        return connection.promise()
        .query(sql, [itemID])
        .then((result) => {
            if (result[0] == 0){
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

    // update inventory
    updateInventoryByItemID: async(inventoryQTY, itemID) => {
        let sql = `UPDATE inventory SET inventoryQTY = ? 
                    WHERE itemID = ?`;

        return connection.promise()
        .query(sql,[inventoryQTY, itemID])
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

    // ===============================
    // Item
    // add item
    addItem: async(itemName, description, supplierID, unitPrice) => {
        let sql = `INSERT INTO item(itemName, description, supplierID, unitPrice) VALUES (?,?,?,?)`;

        return connection.promise()
        .query(sql, [itemName, description, supplierID, unitPrice])
        .catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // get all item
    getAllItem: async() => {
        let sql = `SELECT I.itemID, I.itemName, I.unitPrice, I.supplierID, S.supplierName
                    FROM item I, supplier S
                    WHERE I.supplierID = S.supplierID
                    ORDER BY itemID asc`;

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

    // get item by itemID
    getItemByItemID: async(itemID) => {
        let sql = `SELECT I.itemID, I.itemName, I.unitPrice, I.supplierID, S.supplierName
                    FROM item I, supplier S
                    WHERE I.supplierID = S.supplierID
                    AND I.itemID = ?
                    ORDER BY itemID asc`;
    
        return connection.promise()
        .query(sql, [itemID])
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

    // update item
    updateItemByItemID: async(itemName, description, supplierID, unitPrice, itemID) => {
        let sql = `UPDATE item SET itemName = ?, description = ?, supplierID = ?, unitPrice = ?
                    WHERE itemID = ?`;

        return connection.promise()
        .query(sql,[itemName, description, supplierID, unitPrice, itemID])
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
    }
};

module.exports = inventoryDB;