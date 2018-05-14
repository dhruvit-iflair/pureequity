var BankDetailsCtrl = function () { }
var mongoose = require("mongoose")
var BankDetails = require('../models/bankdetails');

BankDetailsCtrl.prototype.get = function (req, res, next) {

    BankDetails.find()
        .populate("createdBy")
        .populate("updatedBy")
        .populate("user")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if(!doc.length || doc == null || doc == [] || doc == undefined ){
                res.status(404).send({ message: "No Bank Details Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting Bank Detailss" }).end();
            }
        });

}


BankDetailsCtrl.prototype.getById = function (req, res, next) {

    BankDetails.findById(req.params.id)
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
                res.status(404).send({ message: "No BankDetails Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this BankDetails!!" }).end();
            }
        });

}


BankDetailsCtrl.prototype.getByUserId = function (req, res, next) {

    BankDetails.find({user:req.params.id})
        .populate("createdBy")
        .populate("updatedBy")
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc.length && doc[0]._id) {
                res.status(200).send(doc[0]).end();
            }
            else if (!doc.length) {
                res.status(404).send({ message: "No BankDetails Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this BankDetails!!" }).end();
            }
        });

}

BankDetailsCtrl.prototype.post = function (req, res, next) {
    var Bank = new BankDetails(req.body);
        Bank.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No BankDetails found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this BankDetails!!" }).end();
            }
        });

}

BankDetailsCtrl.prototype.put = function (req, res, next) {

    BankDetails.findByIdAndUpdate({ _id: req.params.id }, {$set:req.body}, { new: true })
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
                res.status(404).send({ message: "No BankDetails found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this BankDetails!!" }).end();
            }
        });

}


BankDetailsCtrl.prototype.delete = function (req, res, next) {

    BankDetails.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No BankDetails Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this BankDetails!!" }).end();
        }
    });

}

module.exports = new BankDetailsCtrl();
