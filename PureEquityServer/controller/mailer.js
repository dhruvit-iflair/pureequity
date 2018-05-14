var MailerCtrl = function () { }
var mongoose = require("mongoose")
var Mailer = require('../models/mailer');

MailerCtrl.prototype.get = function (req, res, next) {

    Mailer.find()
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if(!doc.length || doc == null || doc == [] || doc == undefined ){
                res.status(404).send({ message: "No Mail Template Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting template" }).end();
            }
        });

}


MailerCtrl.prototype.getById = function (req, res, next) {

    Mailer.findById(req.params.id)
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No Mail Template Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this template!!" }).end();
            }
        });

}

MailerCtrl.prototype.getByTitle = function (req, res, next) {

    Mailer.find({title:req})
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc[0] && doc[0]._id) {
                res.status(200).send(doc[0]).end();
            }
            else if (!doc[0]) {
                res.status(404).send({ message: "No Mail Template Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this template!!" }).end();
            }
        });

}

MailerCtrl.prototype.post = function (req, res, next) {
    var role = new Mailer(req.body);
        role.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No Mail Template found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this template!!" }).end();
            }
        });

}

MailerCtrl.prototype.put = function (req, res, next) {

    Mailer.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No Mail Template found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this template!!" }).end();
            }
        });

}


MailerCtrl.prototype.delete = function (req, res, next) {

    Mailer.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No Mail Template Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this template!!" }).end();
        }
    });

}

module.exports = new MailerCtrl();
