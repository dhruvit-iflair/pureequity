var MoneyBalanceCtrl = function () { }
var mongoose = require("mongoose")
var MoneyBalance = require('../models/money_balance');

MoneyBalanceCtrl.prototype.get = function (req, res, next) {

    MoneyBalance.find()
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
                res.status(404).send({ message: "No Coin Balance Details Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting Coin Balance Detailss" }).end();
            }
        });

}


MoneyBalanceCtrl.prototype.getById = function (req, res, next) {

    MoneyBalance.findById(req.params.id)
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
                res.status(404).send({ message: "No Coin Balance Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this Coin Balance!!" }).end();
            }
        });

}


MoneyBalanceCtrl.prototype.getByUserId = function (req, res, next) {

    MoneyBalance.find({user:req.params.id})
        // .populate("createdBy")
        // .populate("updatedBy")
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc.length && doc[0]._id) {
                res.status(200).send(doc[0]).end();
            }
            else if (!doc.length) {
                res.status(404).send({ message: "No Coin Balance Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this Coin Balance!!" }).end();
            }
        });

}

MoneyBalanceCtrl.prototype.post = function (req, res, next) {
    var mB = new MoneyBalance(req.body);
        mB.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No Coin Balance found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this Coin Balance!!" }).end();
            }
        });

}

MoneyBalanceCtrl.prototype.put = function (req, res, next) {

    MoneyBalance.findByIdAndUpdate({ _id: req.params.id }, {$set:req.body}, { new: true })
        // .populate("createdBy")
        // .populate("updatedBy")
        // .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No Coin Balance found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this Coin Balance!!" }).end();
            }
        });

}


MoneyBalanceCtrl.prototype.delete = function (req, res, next) {

    MoneyBalance.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No Coin Balance Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this Coin Balance!!" }).end();
        }
    });

}

module.exports = new MoneyBalanceCtrl();
