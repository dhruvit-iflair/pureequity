// dependencies
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var speakeasy = require('speakeasy');
var QRCode = require('qrcode'); 
const path = require('path');
var cores = require('./config/core');
var config = require('./config/config');
var routes = require('./routes/routes');
var app = express();

var db = mongoose.connect(config.connection + config.dbName);   

app.use(cores.permission);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//EXPL: single in memory user
let user = {
    'firstName': "Jon",
    'lastName': "Doe",
    email: "jon.doe@gmail.com",
    password: "test"
}
//setup two factor for logged in user
app.post('/twofactor/setup', function(req, res){
    const secret = speakeasy.generateSecret({length: 10});
    QRCode.toDataURL(secret.otpauth_url, (err, data_url)=>{
        //save to logged in user.
        user.twofactor = {
            secret: "tester",
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url
        };
        return res.json({
            message: 'Verify OTP',
            tempSecret: secret.base32,
            dataURL: data_url,
            otpURL: secret.otpauth_url
        });
    });
});

//before enabling totp based 2fa; it's important to verify, so that we don't end up locking the user.
app.post('/twofactor/verify', function(req, res){
    var verified = speakeasy.totp.verify({
        secret: user.twofactor.tempSecret, //secret of the logged in user
        encoding: 'base32',
        token: req.body.token
    });
    if(verified){
        user.twofactor.secret = user.twofactor.tempSecret; //set secret, confirm 2fa
        return res.send('Two-factor auth enabled');
    }
    return res.status(400).send('Invalid token, verification failed');
});

//get 2fa details
app.get('/twofactor/setup', function(req, res){
    res.json(user.twofactor);
});

//disable 2fa
app.delete('/twofactor/setup', function(req, res){
    delete user.twofactor;
    res.send('success');
});

//login API supports both, normal auth + 2fa
app.post('/twofactorlogin', function(req, res){
    if(!user.twofactor || !user.twofactor.secret){ //two factor is not enabled by the user
        //check credentials
        if(req.body.email == user.email && req.body.password == user.password){
            return res.send('success'); //authenticate user
        }
        return res.status(400).send('Invald email or password');
    } else {
        //two factor enabled
        if(req.body.email != user.email || req.body.password != user.password){
            return res.status(400).send('Invald email or password');
        }
        //check if otp is passed, if not then ask for OTP
        if(!req.headers['x-otp']){
            return res.status(206).send('Please enter otp to continue');
        }
        //validate otp
        var verified = speakeasy.totp.verify({
            secret: user.twofactor.secret,
            encoding: 'base32',
            token: req.headers['x-otp']
        });
        if(verified){ //authenticate user
            return res.send('success');
        } else { //Invalid otp
            return res.status(400).send('Invalid OTP');
        }
    }
});


app.listen(6008, function () {
    console.log('%s listening at :: 6008');
});