var UserCtrl = function () { }
var mongoose = require("mongoose"),
    express = require('express'),
    passport = require('passport'),
    User = require('../models/user'),
    Role = require('../models/role'),
    Reset_Password = require('../models/reset_password'),
    config = require('../config/config'),
    jwt = require('jsonwebtoken'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');

UserCtrl.prototype.get = function (req, res, next) {

    User.find()
        .populate("role")
        .populate("user_profile")
        .populate("createdBy")
        .populate("updatedBy")
        .exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc.length) {
                res.status(200).send(doc).end();
            }
            else if (!doc.length || doc == null || doc == [] || doc == undefined) {
                res.status(404).send({ message: "No User Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting users!!" }).end();
            }
        });

}


UserCtrl.prototype.getById = function (req, res, next) {

    User.findById(req.params.id)
        .populate("role")
        .populate("user_profile")
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
                res.status(404).send({ message: "No User Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this user!!" }).end();
            }
        });

}

UserCtrl.prototype.put = function (req, res, next) {

    User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .populate("role")
        .populate("user_profile")
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
                res.status(404).send({ message: "No User found to update!!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in updating this user!!" }).end();
            }
        });

}

UserCtrl.prototype.patcher = function (req, res, next) {
    var updateObject = req.body;
    User.update({ _id: req.params.id }, { $set: updateObject }, function (er, dtt) {
        if (er) {
            console.log('error occured..' + er);
            res.status(500).send({ message: er.message });
        }
        else {
            res.status(200).send(dtt).end();
            //res.json(dtt);
        }
    });
}

UserCtrl.prototype.delete = function (req, res, next) {

    User.findByIdAndRemove({ _id: req.params.id }, function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc._id) {
            res.status(200).send(doc).end();
        }
        else if (!doc) {
            res.status(404).send({ message: "No User Found that can be deleted!!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in removing this user!!" }).end();
        }
    });

}

UserCtrl.prototype.register = function (req, res) {

    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.register(new User(req.body), req.body.password, function (err, doc) {
                if (err) {
                    return res.status(409).send({ message: "A user is already register with this email address" }).end();
                }
                else if (doc && doc._id) {
                    done(err, token, doc);
                }
                else if (!doc) {
                    return res.status(404).send({ message: "No User Found !!" }).end();
                }
                else {
                    return res.status(500).send({ message: "Error in removing this user!!" }).end();
                }
            });
        },
        function (token, user, done) {
            var smtpTrans = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.ImapEmailer,
                    pass: config.ImapSect
                }
            });
            var mailOptions = {
                from: 'no-replay@PureEquity.com',
                to: user.username,
                subject: 'Welcome to Pure Equity',
                text: 'You are receiving this because you (or someone else) have requested registration for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to verify your email account:\n\n' +
                    'http://' + config.redirectionHost + '/verify?token=' + token + ' \n\n'
            };
            smtpTrans.sendMail(mailOptions, function (err) {
                console.log("Email sent to :: " + user.username);
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
                        res.status(200).send({ message: "Please check your email's inbox we have send you a verification link!!" });
                    }
                    else if (!reset) {
                        res.status(404).send({ message: "No Token generated !!" }).end();
                    }
                    else {
                        res.status(500).send({ message: "Error in generating token for this user !!" }).end();
                    }
                });
            });
        }
    ], function (err) {
        console.log('this err' + ' ' + err)
        res.status(500).send({ message: "Error in resetting password this user!!" }).end();
    });
}

UserCtrl.prototype.login = function (req, res) {

    passport.authenticate('local')(req, res, function () {
        if (req.user) {
            var token = jwt.sign({ _id: req.user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            if (req.user.is2FAEnabled === true && !req.user.token.twofactor.tempSecret && !req.user.token.twofactor.dataURL && !req.user.token.twofactor.otpURL) {

                var secretoptions = {
                    issuer: 'Google',
                    //label:req.user.username,
                    name: req.user.username,
                    length: 10
                }
                const secret = speakeasy.generateSecret(secretoptions);
                //const secret = speakeasy.generateSecret({ length: 10 });
                QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
                    //save to logged in user.
                    var xuser = { twofactor: {} };
                    xuser.twofactor = {
                        secret: "chakusulowakia",
                        tempSecret: secret.base32,
                        dataURL: data_url,
                        otpURL: secret.otpauth_url
                    };
                    var obj = {};
                    obj.user = req.user;
                    obj.xuser = xuser;
                    //update token and qr in user
                    var updateObject = { token: obj.xuser };
                    User.update({ _id: req.user._id }, { $set: updateObject }, function (er, dt) {
                        if (er) {
                            console.log('error occured..' + er);
                        }
                        else {
                            res.status(200).send({ data: xuser, token: token, user: req.user });
                        }
                    });
                });
            }
            else {
                var objfactor = {};
                objfactor.twofactor = req.user.token.twofactor;
                Role.findById(req.user.role, function (err, doc) {
                    if (doc) {
                        req.user.role = doc
                        res.status(200).send({ auth: true, data: objfactor, token: token, user: req.user });
                    }
                    else {
                        res.status(500).send({ auth: false, message: 'Something went wrong !!' });
                    }
                });
                //res.status(200).send({ auth: true, token: token, user: req.user });
            }
            //res.status(200).send({ auth: true, token: token, user: req.user });
        } else {
            res.status(401).send({ auth: false, message: 'Unauth' });
        }
    });

}
UserCtrl.prototype.verifyotp = function (req, res) {
    //validate otp
    var verified = speakeasy.totp.verify({
        secret: req.body.key,
        encoding: 'base32',
        token: req.body.totp
    });
    if (verified) { //authenticate user
        return res.send({ verificationstatus: 'success' });
    } else { //Invalid otp
        return res.status(400).send({ verificationstatus: 'Invalid OTP' });
    }
}
UserCtrl.prototype.verify = function (req, res) {

    async.waterfall([
        function (done) {
            Reset_Password.find({ token: req.body.token.toString() }).populate('user').exec(function (err, doc) {
                if (err) {
                    done({ status: 500, message: err.message });
                }
                else if (doc.length && doc[0]._id && doc[0].user.isVerifyEmail) {
                    done({ status: 200, message: "This email is already verified" });
                }
                else if (doc.length && doc[0]._id && !doc[0].user.isVerifyEmail) {
                    if (!doc[0].isUsed && Date.now() < doc[0].tokentime) {
                        Reset_Password.findByIdAndUpdate(doc[0]._id, { isUsed: true }, function (er, dotc) {
                            if (er) {
                                done({ status: 500, message: er.message });
                            }
                            else if (dotc && dotc._id) {
                                done(err, doc[0]);
                            }
                            else {
                                done({ status: 404, message: "Error in checking for token" });
                            }
                        })
                    }
                    else if (!doc[0].isUsed && Date.now() > doc[0].tokentime) {
                        async.waterfall([
                            function (don) {
                                crypto.randomBytes(20, function (err, buf) {
                                    var tok = buf.toString('hex');
                                    don(err, tok);
                                });
                            },
                            function (tok, don) {
                                var u = {
                                    token: tok,
                                    tokentime: Date.now() + 3600000,
                                    isUsed: false,
                                    user: doc[0].user._id
                                }
                                var rr = new Reset_Password(u);
                                rr.save(function (er, dotc) {
                                    if (er) {
                                        don({ status: 500, message: er.message });
                                    }
                                    else if (dotc && dotc._id) {
                                        console.log("Token Expired for ::" + dotc);
                                        User.findById(dotc.user, function (ert, dtaoc) {
                                            (dtaoc) ? dotc.user = dtaoc : null;
                                            don(err, tok, dotc);
                                        })
                                    }
                                    else {
                                        don({ status: 404, message: "Error in checking for token" });
                                    }
                                })
                            },
                            function (tok, user, don) {
                                var smtpTrans = nodemailer.createTransport({
                                    host: 'smtp.gmail.com',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: config.ImapEmailer,
                                        pass: config.ImapSect
                                    }
                                });
                                var mailOptions = {
                                    from: 'no-replay@PureEquity.com',
                                    to: user.user.username,
                                    subject: 'Verify your Account',
                                    text: 'You are receiving this because you (or someone else) have requested verification for your account.\n\n' +
                                        'Please click on the following link, or paste this into your browser to verify your email account:\n\n' +
                                        'http://' + config.redirectionHost + '/verify?token=' + tok + ' \n\n'
                                };
                                smtpTrans.sendMail(mailOptions, function (err) {
                                    console.log("Email sent to coz token expired :: " + user.user.username);
                                    return res.status(200).send({ message: "Please check your email's inbox we have send you another verification link!!" }).end();
                                    // don(err,{status : 200, message: "Please check your email's inbox we have send you a verification link!!"});
                                });
                            }
                        ], function (err, resty) {
                            if (err) {
                                done(err);
                            }
                            else {
                                done(err, resty, doc[0]);
                            }
                        });
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
            User.findOneAndUpdate({ username: reset.user.username }, { isVerifyEmail: true }, { new: true }, function (err, dt) {
                if (err) {
                    done({ status: 500, message: err.message });
                }
                else if (!dt) {
                    done({ status: 404, message: "Error no user find" });
                }
                else if (dt && dt._id) {
                    done(err, reset, dt);
                }
                else {
                    done({ status: 500, message: "Error in verifying user token !!" });
                }
            });

        },
        function (reset, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.ImapEmailer,
                    pass: config.ImapSect
                }
            });
            var mailOptions = {
                from: 'passwordreset@demo.com',
                to: user.username,
                subject: 'Account Verified!!',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the your account ' + user.username + ' has just been verified.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.status(200).send({ message: "Account Verified!! Please login" }).end()
                done(err);
            });
        }
    ], function (err, result) {
        if (err) {
            console.log("Error in Restting token :: ", err);
            // done({status : , message: });
            res.status(err.status).send({ message: err.message }).end()
        }
        else {
            res.status(result.status).send({ message: result.message }).end()
        }
    });

}

UserCtrl.prototype.image = function (req, res) {
    console.log(req.files)
    if (!req.files)
        return res.status(400).send('No Image was uploaded.');

    let image = req.files.image;
    var ext = image.name.split('.');
    var tim = Date.now();
    var imageName = tim + "." + ext[ext.length - 1];
    image.mv('./uploads/users/profileImage/' + imageName, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send(err);
        }
        else {
            res.status(200).send({ image: imageName });
        }
    });
}

UserCtrl.prototype.deleteImage = function (req, res) {
    console.log("Will delete image")
}
UserCtrl.prototype.change_password = function (req, res) {

    User.findByUsername(req.body.username).then(function (getUser) {
        var new_password = req.body.password;
        if (getUser) {
            getUser.setPassword(new_password, function () {
                getUser.save(function (er, dt) {
                    if (er) {
                        console.log('error occured..' + er);
                    }
                    res.status(200).send({ message: "Password Changed Successfully !!" }).end()            
                });
            });
        }
        else {
            res.status(404).send({auth:false, message: 'This User does not exist!'});
        }
    }, function (errpt) {
        console.log(errpt);
    });
}

module.exports = new UserCtrl();
