const purchaseRequestModel = require('../model/purchaseRequest');

// ===============================
// PR
// add PR
module.exports.addPR = async(req, res, next) => {
    let requestDate = req.body.requestDate;
    let userId = req.body.userID;
    let supplierId = req.body.supplierID;
    let paymentModeId = req.body.paymentModeID;
    let branchId = req.body.branchID;
    let remarks = req.body.remarks;

    return purchaseRequestModel
    .addPR(requestDate, userId, supplierId, paymentModeId, branchId, remarks)
    .then(() => {
        return res.status(201).send(`Purchase Request Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });

};

// get all PR
module.exports.getAllPR = async(req, res, next) => {
    return purchaseRequestModel
    .getAllPR()
    .then((result) => {
        if (result == null){
            res.send(404).send(`There are no Purchase Requests Available`);
        }
        else{
            res.status(200).send(result);
        }
    });
};

// get PR by userid
module.exports.getPRByUserID = async(req, res, next) => {
    let userId = parseInt(req.params.id);

    if(isNaN(userId)){
        res.status(400).send(`UserId provided is not a number!`);
        return;
    }

    return purchaseRequestModel
    .getPRByUserID(userId)
    .then((result) => {
        if(result == null){
            res.status(404).send(`Purchase Requests Do not exist!`);
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

// get PR by PR status

// get PR by PR ID
module.exports.getPRByPRID = async(req, res, next) => {
    let prId = parseInt(req.params.id);

    if(isNaN(prId)){
        res.status(400).send(`UserId provided is not a number!`);
        return;
    }

    return purchaseRequestModel
    .getPRByPRID(prId)
    .then((result) => {
        if(result == null){
            res.status(404).send(`Purchase Request #${prId} does not exist!`);
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

// update PR by PR ID (Approver) ------> approver remarks?
module.exports.updatePRStatus = async(req, res, next) => {
    let prId = parseInt(req.params.id);
    let prStatusId = req.body.prStatusID;

    if (isNaN(prId)) {
        res.status(400).send(`Purchase Request ID provided is not a number!`);
        return;
    };

    return purchaseRequestModel
    .updatePRStatus(prStatusId, prId)
    .then((result) => {
        if(result.affectedRows == 0){
            res.status(404).send(`Purchase Request #${prId} does not exist!`);
        }
        else{
            res.status(201).send(`Purchase Request Status Updated!`);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(`Unknown error`);
    });
};

// delete PR
module.exports.deletePRById = async(req, res, next) => {
    let prId = parseInt(req.params.id);

    if (isNaN(prId)) {
        res.status(400).send(`Purchase Request ID provided is not a number!`);
        return;
    };

    return purchaseRequestModel
    .deletePR(prId)
    .then((result) => {
        if(result.affectedRows == 0){
            res.status(404).send(`Purchase Request #${prId} does not exist!`);
        }
        else{
            res.status(201).send(`Purchase Request #${prId} has been deleted!`);
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send(`Unknown error`);
    });
};

// ===============================
// Line Items
// add line item
module.exports.addLineItem = async(req, res, next) => {
    let prId = req.body.prID;
    let itemId = req.body.itemID;
    let quantity = req.body.quantity;
    let totalUnitPrice = req.body.totalUnitPrice;

    return purchaseRequestModel
    .addLineItem(prId, itemId, quantity, totalUnitPrice)
    .then(() => {
        return res.status(201).send(`Line Item Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });
};

// get line item by PR ID
// get PR by PR ID
module.exports.getLineItemByPRID = async(req, res, next) => {
    let prId = parseInt(req.params.id);
    console.log(prId)
    if(isNaN(prId)){
        // console.log(prId)
        res.status(400).send(`UserId provided is not a number!`);
        return;
    }

    return purchaseRequestModel
    .getLineItemByPRID(prId)
    .then((result) => {
        if(result == null){
            res.status(404).send(`Line Item does not exist in Purchase Request #${prId}!`);
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

// ===============================
// Payment Mode
// add payment mode
module.exports.addPaymentMode = async(req, res, next) => {
    let paymentMode = req.body.paymentMode;

    return purchaseRequestModel
    .addPaymentMode(paymentMode)
    .then(() => {
        return res.status(201).send(`Payment Mode Type Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });
};

// get all payment modes
module.exports.getAllPaymentMode = async(req, res, next) => {
    return purchaseRequestModel
    .getAllPaymentMode()
    .then((result) => {
        if (result == null){
            res.send(404).send(`There are no Payment Modes Available`);
        }
        else{
            res.status(200).send(result);
        }
    });
};

// ===============================
// Branch
// add branch
module.exports.addBranch = async(req, res, next) => {
    let branchName = req.body.branchName;
    let address = req.body.address;

    return purchaseRequestModel
    .addBranch(branchName, address)
    .then(() => {
        return res.status(201).send(`Branch Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });
};

// get all branch
module.exports.getAllBranch = async(req, res, next) => {
    return purchaseRequestModel
    .getAllBranch()
    .then((result) => {
        if (result == null){
            res.send(404).send(`There are no Branches Available`);
        }
        else{
            res.status(200).send(result);
        }
    });
};

// get branch by id

    
// ===============================
// PR status
// add PR status
module.exports.addPRStatusType = async(req, res, next) => {
    let prStatus = req.body.prStatus;

    return purchaseRequestModel
    .addPRStatusType(prStatus)
    .then(() => {
        return res.status(201).send(`Purchase Order Status Type Created!`);
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).send(`Unknown Error`);
    });
};


// get all PR status
module.exports.getAllPRStatusType = async(req, res, next) => {
    return purchaseRequestModel
    .getAllPRStatusType()
    .then((result) => {
        if (result == null){
            res.send(404).send(`There are no Purchase Request Status Types Available`);
        }
        else{
            res.status(200).send(result);
        }
    });
};

// get status by id 