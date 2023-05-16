const express = require('express');

const router = express.Router();

const paymentTrackController = require('../../controller/paymentTrackController');

//  to test in postman 
//  --> http://localhost:3000/api/[refer main route]/[id if have]
//  --> ensure that individual routes does not have verbs
//  ---> example: http://localhost:3000/api/user/
//  ---> example2: http://localhost:3000/api/user/:id


//create status
router.post('/', paymentTrackController.createPaymentStatus);
//get status by id
router.get('/:paymentStatusID', paymentTrackController.getPaymentStatusById);
//get all status 
router.get('/', paymentTrackController.getAllPaymentStatus);
//update status by id
router.put('/:paymentStatusID', paymentTrackController.updatePaymentStatusByID);
//delete status by id
router.delete('/:paymentStatusID', paymentTrackController.deletePaymentStatusByID);


module.exports = router;