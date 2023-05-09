const express = require('express');

const router = express.Router();

// for each routes file, add a const & router.use

const DBTableRoutes = require('./DBTableRoutes');
const purchaseReqRoutes = require('./idvRoutes/purchaseReqRoutes');
const purchaseOrderRoutes = require('./idvRoutes/purchaseOrderRoutes');
const supplierRoutes = require('./idvRoutes/supplierRoutes');

// Database Route
router.use('/DBTable', DBTableRoutes);

// Individual Routes
router.use('/purchaseReq', purchaseReqRoutes);
router.use('/purchaseOrder', purchaseOrderRoutes);
router.use('/supplier', supplierRoutes);


module.exports = router;