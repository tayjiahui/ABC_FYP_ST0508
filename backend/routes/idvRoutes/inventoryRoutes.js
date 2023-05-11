const express = require('express');
const router = express.Router();

const inventoryController = require('../../controller/inventoryController');

//  to test in postman 
//  --> http://localhost:3000/api/[refer main route]/[id if have]
//  --> ensure that individual routes does not have verbs
//  ---> example: http://localhost:3000/api/user/
//  ---> example2: http://localhost:3000/api/user/:id

// Inventory
router.post('/', inventoryController.addInventory);
router.get('/:id', inventoryController.getInventoryByItemID);
router.put('/:id', inventoryController.updateInventoryByItemID);

// Item
router.post('/item', inventoryController.addItem);
router.get('/item/all', inventoryController.getAllItem);
router.get('/item/:id', inventoryController.getItemByItemID);
router.put('/item/:id', inventoryController.updateItemByItemID);


module.exports = router;