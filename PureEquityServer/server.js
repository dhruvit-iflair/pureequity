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
var fileUpload = require('express-fileupload');

var app = express();

var db = mongoose.connect(config.connection + config.dbName,{useMongoClient: true});   

app.use(cores.permission);
app.use(logger('combined'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false, parameterLimit:50000 }));

app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());
app.use('/uploads',express.static(path.join(__dirname, './uploads')));

app.use('/', routes);
// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(6008, function () {
    console.log('listening at :: 6008');
});