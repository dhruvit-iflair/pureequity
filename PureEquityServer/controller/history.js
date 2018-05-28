var HistoryCtrl = function () { }
var mongoose = require("mongoose")
var History = require('../models/history');

HistoryCtrl.prototype.get = function (req, res, next) {

    History.find()
        .populate("user")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if(!doc.length || doc == null || doc == [] || doc == undefined ){
                res.status(404).send({ message: "No History Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting History" }).end();
            }
        });

}


HistoryCtrl.prototype.getById = function (req, res, next) {

    History.findById(req.params.id)
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No History Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this History!!" }).end();
            }
        });

}


HistoryCtrl.prototype.getByUserId = function (req, res, next) {

    History.find({user:req.params.id})
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc.length && doc[0]._id) {
                res.status(200).send(doc[0]).end();
            }
            else if (!doc.length) {
                res.status(404).send({ message: "No History Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this History!!" }).end();
            }
        });

}

HistoryCtrl.prototype.post = function (req, res, next) {
    var hist = new History(req.body);
        hist.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No History found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this History!!" }).end();
            }
        });

}

HistoryCtrl.prototype.put = function (req, res, next) {

    History.findByIdAndUpdate({ _id: req.params.id }, {$set:req.body}, { new: true })
        .populate("user")        
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No History found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this History!!" }).end();
            }
        });

}


HistoryCtrl.prototype.delete = function (req, res, next) {

    History.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No History Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this History!!" }).end();
        }
    });

}

module.exports = new HistoryCtrl();
