var MailerCtrl = function () { }
var mongoose = require("mongoose")
var Mailer = require('../models/mailer');
var config = require('../config/config');
var nodemailer = require('nodemailer');
var smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.ImapEmailer,
        pass: config.ImapSect
    }
});

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

MailerCtrl.prototype.send = function (req, res, next) {
    Mailer.find({ title: req.body.title }).exec(function (er, docker) {
        if (er) {
            res.status(400).send({ message: er });
        }
        else {
            if (docker[0]) {
                for (let i = 0; i < req.body.search.length; i++) {
                    var founder = docker[0].content.search(req.body.search[i]);
                    if (founder > -1) {
                        var x = docker[0].content.split(req.body.search[i]);
                        docker[0].content = x[0] + req.body.replace[i] + x[1];
                    }
                    if (i == req.body.search.length -1) {
                        var mailOptions = {
                            from: req.body.from,
                            to: req.body.to,
                            subject: docker[0].subject,
                            html: docker[0].content
                        };
                        smtpTrans.sendMail(mailOptions, function (err) {
                            console.log("Email sent to :: " + req.body.to + "from " + req.body.from);
                                if (err) {
                                    res.status(500).send({ message: err.message });
                                }
                                else {
                                    res.status(200).send({ message: req.body.respmessage });                        
                                }
                           
                        });                        
                    }
                }                
            }
            else {
                res.status(500).send({ message: "Something went wrong" });                        
            }
        }
    });

}

module.exports = new MailerCtrl();
