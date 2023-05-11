// DB Tables creations
const express = require('express');

const router = express.Router();

const DBTablesController = require('../controller/DBTablesController');

//  to test in postman 
//  --> http://localhost:3000/api/[refer main route]/[id if have]
//  --> ensure that individual routes does not have verbs
//  ---> example: http://localhost:3000/api/user/
//  ---> example2: http://localhost:3000/api/user/:id

// category, suppliers, supplierCategory
router.use('/category', DBTablesController.categoryTable);
router.use('/supplier', DBTablesController.suppliersTable);
router.use('/supplierscategory', DBTablesController.suppliersCategoryTable);

module.exports = router;