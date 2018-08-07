var CoinTransactionCtrl = function () { }
var mongoose = require("mongoose")
var CoinTransaction = require('../models/coin_transaction');

CoinTransactionCtrl.prototype.get = function (req, res, next) {

    CoinTransaction.find()
        // .populate("createdBy")
        // .populate("updatedBy")
        // .populate("user")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if(!doc.length || doc == null || doc == [] || doc == undefined ){
                res.status(404).send({ message: "No transaction Details Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting transaction Detailss" }).end();
            }
        });

}


CoinTransactionCtrl.prototype.getById = function (req, res, next) {

    CoinTransaction.findById(req.params.id)
        .populate("createdBy")
        .populate("updatedBy")
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No transaction Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this transaction!!" }).end();
            }
        });

}


CoinTransactionCtrl.prototype.getByUserId = function (req, res, next) {

    CoinTransaction.find({user:req.params.id})
        // .populate("createdBy")
        // .populate("updatedBy")
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc.length && doc[0]._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc.length) {
                res.status(404).send({ message: "No transaction Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this transaction!!" }).end();
            }
        });

}

CoinTransactionCtrl.prototype.post = function (req, res, next) {
    var Transa = new CoinTransaction(req.body);
        Transa.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No transaction found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this transaction!!" }).end();
            }
        });

}

CoinTransactionCtrl.prototype.put = function (req, res, next) {

    CoinTransaction.findByIdAndUpdate({ _id: req.params.id }, {$set:req.body}, { new: true })
        // .populate("createdBy")
        // .populate("updatedBy")
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No transaction found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this transaction!!" }).end();
            }
        });

}


CoinTransactionCtrl.prototype.delete = function (req, res, next) {

    CoinTransaction.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No transaction Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this transaction!!" }).end();
        }
    });

}

module.exports = new CoinTransactionCtrl();
