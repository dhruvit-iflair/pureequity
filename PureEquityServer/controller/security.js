var SecurityCtrl = function () { }
var mongoose = require("mongoose")
var User = require('../models/user');
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');


SecurityCtrl.prototype.setup = function (req, res, next) {
    var secretoptions = {
        issuer: 'PureEquity',
        name: req.body.username,
        length: 10
    }
    const secret = speakeasy.generateSecret(secretoptions);
    //const secret = speakeasy.generateSecret({ length: 10 });
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        //save to logged in user.
        var xuser = { twofactor: {} };
        xuser.twofactor = {
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url
        };
        //update token and qr in user
        var updateObject = { token: xuser };
        User.update({ username: secretoptions.name }, { $set: updateObject }, function (er, dt) {
            if (er) {
                console.log('error occured..' + er);
            }
            else {
                res.status(200).send({ data: xuser });
            }
        });
    });
}

SecurityCtrl.prototype.verifyotp = function (req, res) {
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
module.exports = new SecurityCtrl();
