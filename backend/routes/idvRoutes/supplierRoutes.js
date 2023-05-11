const express = require('express');

const router = express.Router();

const supplierController = require('../../controller/supplierController');

//  to test in postman 
//  --> http://localhost:3000/api/[refer main route]/[id if have]
//  --> ensure that individual routes does not have verbs
//  ---> example: http://localhost:3000/api/user/
//  ---> example2: http://localhost:3000/api/user/:id

// create category
router.post('/category', supplierController.createCategory);

// create supplier
router.post('/', supplierController.createSupplier);

// create supplierscategory
router.post('/suppliersCategory', supplierController.createSuppliersCategory);

// retrieve all suppliers (company logo, id, name, categories)
router.get('/all', supplierController.getAllSuppliers);

// retrieve full supplier details by fkSupplier_id
router.get('/:fkSupplier_id', supplierController.getFullSupplierDetailsByID);

// update supplier - category not included
router.put('/:supplierID', supplierController.updateSupplierDetails);

// delete supplier - category not included
router.delete('/:supplierID', supplierController.deleteSupplier);

module.exports = router;