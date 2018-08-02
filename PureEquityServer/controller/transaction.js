var TransactionCtrl = function () { }
var mongoose = require("mongoose")
var Transaction = require('../models/transaction');

TransactionCtrl.prototype.get = function (req, res, next) {

    Transaction.find()
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


TransactionCtrl.prototype.getById = function (req, res, next) {

    Transaction.findById(req.params.id)
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


TransactionCtrl.prototype.getByUserId = function (req, res, next) {

    Transaction.find({user:req.params.id})
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

TransactionCtrl.prototype.post = function (req, res, next) {
    var Transa = new Transaction(req.body);
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

TransactionCtrl.prototype.put = function (req, res, next) {

    Transaction.findByIdAndUpdate({ _id: req.params.id }, {$set:req.body}, { new: true })
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


TransactionCtrl.prototype.delete = function (req, res, next) {

    Transaction.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
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

module.exports = new TransactionCtrl();
