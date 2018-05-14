var User_ProfileCtrl = function () { }
var mongoose = require("mongoose")
var User_Profile = require('../models/user_profile');

User_ProfileCtrl.prototype.get = function (req, res, next) {

    User_Profile.find()
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if (!doc.length || doc == null || doc == [] || doc == undefined ) {
                res.status(404).send({ message: "No User Profile Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting User Profile!!" }).end();
            }
        });

}


User_ProfileCtrl.prototype.getById = function (req, res, next) {

    User_Profile.findById(req.params.id)
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
                res.status(404).send({ message: "No User Profile Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this User Profile!!" }).end();
            }
        });

}

User_ProfileCtrl.prototype.getByUid = function (req, res, next) {

    User_Profile.find({createdBy:req.params.id})
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc[0] && doc[0]._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc[0]) {
                res.status(404).send({ message: "No User Profile Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this User Profile!!" }).end();
            }
        });

}

User_ProfileCtrl.prototype.post = function (req, res, next) {
    var user_profile = new User_Profile(req.body);
        user_profile.save(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No User Profile found to save!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this User Profile!!" }).end();
            }
        });

}

User_ProfileCtrl.prototype.put = function (req, res, next) {

    User_Profile.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
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
                res.status(404).send({ message: "No User Profile found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this User Profile!!" }).end();
            }
        });

}


User_ProfileCtrl.prototype.delete = function (req, res, next) {

    User_Profile.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No User Profile Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this User Profile!!" }).end();
        }
    });

}

module.exports = new User_ProfileCtrl();
