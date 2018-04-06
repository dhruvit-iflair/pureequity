var RoleCtrl = function () { }
var mongoose = require("mongoose")
var Role = require('../models/role');

RoleCtrl.prototype.get = function (req, res, next) {

    Role.find()
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
                res.status(404).send({ message: "No Role Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting roles" }).end();
            }
        });

}


RoleCtrl.prototype.getById = function (req, res, next) {

    Role.findById(req.params.id)
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
                res.status(404).send({ message: "No Role Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this role!!" }).end();
            }
        });

}

RoleCtrl.prototype.post = function (req, res, next) {
    var role = new Role(req.body);
        role.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No role found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this role!!" }).end();
            }
        });

}

RoleCtrl.prototype.put = function (req, res, next) {

    Role.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
                res.status(404).send({ message: "No role found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this role!!" }).end();
            }
        });

}


RoleCtrl.prototype.delete = function (req, res, next) {

    Role.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No Role Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this role!!" }).end();
        }
    });

}

module.exports = new RoleCtrl();
