var Reset_PasswordCtrl = function () { }
var mongoose = require("mongoose"),
    config = require('../config/config'),
    Reset_Password = require('../models/reset_password'),
    User = require('../models/user'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');
var mailer = require('../models/mailer');
var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.ImapEmailer,
        pass: config.ImapSect
    }
});

Reset_PasswordCtrl.prototype.generate = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.find({ username: req.params.email }).exec(function (err, doc) {
                if (err) {
                    res.status(500).send({ message: err.message });
                }
                else if (doc.length && doc[0]._id) {
                    done(err, token, doc[0]);
                }
                else if (!doc.length) {
                    res.status(404).send({ message: "No User Found with this email." }).end();
                }
                else {
                    res.status(500).send({ message: "Error in resetting password this email." }).end();
                }
            });
        },
        function (token, user, done) {
            mailer.find({title:'Reset Password'})
            .exec(function(er,docker){
                if(er){
                    res.status(400).send({message:er});
                }
                else{
                    if (docker[0]) {
                        var founder=docker[0].content.search("[(resetLink)]");
                        if(founder>-1){
                            var x=docker[0].content.split("[(resetLink)]");
                            docker[0].content=x[0]+'http://' + config.redirectionHost + '/reset?token=' + token + '\n\n' +x[1];
                        }
                        var mailOptions = {
                            from: 'no-replay@PureEquity.com',
                            to: user.username,
                            subject: docker[0].subject,
                            text:docker[0].content
                            // text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            //     'http://' + config.redirectionHost + '/reset?token=' + token + '\n\n' +
                            //     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            console.log("Email sent to :: " + user.username);
                            Reset_Password.find({ user: user._id, isUsed: false }).exec(function (err, re) {
                                if (err) {
                                    res.status(500).send({ message: err.message });
                                }
                                else if (re.length && re[0]._id) {
                                    var data = {
                                        token: token,
                                        tokentime: Date.now() + 3600000,
                                        user: user._id
                                    }
                                    Reset_Password.findByIdAndUpdate(re[0]._id, data, function (err, reset) {
                                        if (err) {
                                            res.status(500).send({ message: err.message });
                                        }
                                        else if (reset && reset._id) {
                                            res.status(200).send({ message: "Please Check you email's Inbox" }).end();
                                        }
                                        else if (!reset) {
                                            res.status(404).send({ message: "No Token generated !!" }).end();
                                        }
                                        else {
                                            res.status(500).send({ message: "Error in resetting password this user !!" }).end();
                                        }
                                    });
                                }
                                else if (!re.length) {
                                    var data = {
                                        token: token,
                                        tokentime: Date.now() + 3600000,
                                        user: user._id
                                    }
                                    var reset_password = new Reset_Password(data);
        
                                    reset_password.save(function (err, reset) {
                                        if (err) {
                                            res.status(500).send({ message: err.message });
                                        }
                                        else if (reset && reset._id) {
                                            res.status(200).send({ message: "Please Check you email's Inbox" }).end();
                                        }
                                        else if (!reset) {
                                            res.status(404).send({ message: "No Token generated !!" }).end();
                                        }
                                        else {
                                            res.status(500).send({ message: "Error in generating token for this user !!" }).end();
                                        }
                                    });
                                }
                                else {
                                    res.status(500).send({ message: "Error in getting token this user !!" }).end();
                                }
        
                            })
                        });
                    }
                }
            });
        }
    ], function (err) {
        console.log('this err' + ' ' + err)
        res.status(500).send({ message: "Error in resetting password this user!!" }).end();
    });
}
Reset_PasswordCtrl.prototype.verify = function (req, res, next) {
    async.waterfall([
        function (done) {
            Reset_Password.find({ token: req.body.token }).populate('user').exec(function (err, doc) {
                if (err) {
                    res.status(500).send({ message: err.message });
                }
                else if (doc.length && doc[0]._id) {
                    if (Date.now() < doc[0].tokentime && !doc[0].isUsed) {
                        Reset_Password.findByIdAndUpdate(doc[0]._id, { isUsed: true }, function (er, dotc) {
                            if (er) {
                                res.status(500).send({ message: er.message });
                            }
                            else if (dotc && dotc._id) {
                                done(err, doc[0]);
                            }
                            else {
                                res.status(404).send({ message: "Error in checking for token" });
                                done(true);
                            }
                        })
                    }
                    else {
                        res.status(500).send({ message: "This link is Expired please generate new one " }).end();
                    }
                }
                else if (!doc.length) {
                    res.status(404).send({ message: "No token Found please generate new one!!" }).end();
                }
                else {
                    res.status(500).send({ message: "Error in verifying token !!" }).end();
                }
            });
        },
        function (reset, done) {
            User.findByUsername(reset.user.username).then(function (doc) {
                var newPass = req.body.password;
                if (doc) {
                    var updateObject = reset.user;
                    if (req.body.password) {
                        doc.setPassword(newPass, function () {
                            doc.save();
                        });
                    }
                    User.findOneAndUpdate({ username: reset.user.username }, { $set: updateObject }, { new: true }, function (err, dt) {
                        if (err) {
                            return res.status(500).send({ message: err.message });
                        }
                        else if (!dt) {
                            return res.status(404).send({ message: "Error in finding user with this token!!" }).end();
                        }
                        else if (dt && dt._id) {
                            done(err, reset, dt);
                        }
                        else {
                            res.status(500).send({ message: "Error in verifying user token !!" }).end();
                        }
                    });
                }
                else {
                    res.status(500).send({ message: "Error in finding user with this token !!" }).end();
                }
            });
        },
        function (reset, user, done) {
            mailer.find({title:'Inform Reset Password'})
            .exec(function(er,docker){
                if(er){
                    res.status(400).send({message:er});
                }
                else{
                    if (docker[0]) {
                        var founder=docker[0].content.search("[(user)]");
                        if(founder>-1){
                            var x=docker[0].content.split("[(user)]");
                            docker[0].content=x[0]+user.username +x[1];
                        }
                        var mailOptions = {
                            from: 'no-replay@PureEquity.com',
                            to: user.username,
                            subject: docker[0].subject,
                            text:docker[0].content
                            // text: 'Hello,\n\n' +
                            //     'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            res.status(200).send({ message: "Password Reset Successfully!! Login with new Password" }).end()
                            done(err);
                        });
                    }
                }
            });
        }
    ], function (err) {
        if (err) {
            console.log("Error in Restting token :: ", err);
        }
    });
}
Reset_PasswordCtrl.prototype.getByToken = function (req, res, next) {
    Reset_Password.find({ token: req.params.token }).populate('user').exec(function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc.length && doc[0]._id) {
            if (Date.now() < doc[0].tokentime && !doc[0].isUsed) {
                res.status(200).send({ auth: true }).end();
            }
            else {
                res.status(500).send({ message: "This link is Expired please generate new one " }).end();
            }
        }
        else if (!doc.length) {
            res.status(404).send({ message: "Unauthorized token Found please generate new one !!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in verifying token !!" }).end();
        }
    });
}

module.exports = new Reset_PasswordCtrl();
