const express = require('express');

const router = express.Router();

const purchaseOrderController = require('../../controller/purchaseOrderController');

//  to test in postman 
//  --> http://localhost:3000/api/[refer main route]/[id if have]
//  --> ensure that individual routes does not have verbs
//  ---> example: http://localhost:3000/api/user/
//  ---> example2: http://localhost:3000/api/user/:id



module.exports = router;