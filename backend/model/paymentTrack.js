const connection = require('../db');

const paymentTrackDB = {
    //create status
    createPaymentStatus: async(status) => {
        let sql = 'INSERT INTO paymentStatus (paymentStatus) VALUES (?)';
        return connection.promise()
        .query(sql, [status])
        .catch((err) => {
            console.log(err)
            throw err;
        })
    },

    //get payment status by id
    getPaymentStatusById: async(statusid) => {
        let sql = 'SELECT paymentStatus FROM paymentStatus WHERE paymentStatusID = ?';

        return connection.promise()
        .query(sql, [statusid])
        .then((result) => {
            if (result.length == 0) {
                return null;
            }
            else {
                return result[0]
            }
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
    },

    //get all payment status
    getAllPaymentStatus: async() => {
        let sql = 'SELECT paymentStatus from paymentStatus';

        return connection.promise()
        .query(sql)
        .then((result) => {
            console.log("gets all statuses");

            if (result.length == 0) {
                return null;
            }
            else {
                return result[0];
            }
        })
        .catch((err) => {
            console.log(err);
            return err;
        })
    },

    //update payment status
    updatePaymentStatusByID: async(statusID, paymentStatus) => {
        let sql = 'UPDATE paymentStatus SET paymentStatus = ? WHERE paymentStatusID = ?';

        return connection.promise()
        .query(sql, [paymentStatus, statusID, ])
        .catch((err) => {
            console.log(err);
            throw err;
        })
    },

    //delete payment status 
    deletePaymentStatusByID: async(statusid) => {
        let sql = 'DELETE FROM paymentStatus WHERE paymentStatusID = ?';

        return connection.promise()
        .query(sql, [statusid])
        .then((result) => {
            if (result.length == 0) {
                return null;
            } 
            else {
                return result[0]
            }
        })
        .catch((err) => {
            console.log(err);
            return err
        })
    },

};

module.exports = paymentTrackDB;