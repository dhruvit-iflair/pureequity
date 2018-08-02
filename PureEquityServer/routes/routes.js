var express = require('express');
var passport = require('passport');
var router = express.Router();
var UserCtrl = require('../controller/users');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var verify = require('../config/jwt');

router.get('/', function (req, res) {
    res.send("")
});

router.post('/register', UserCtrl.register);

router.post('/login', UserCtrl.login);

router.get('/logout', function (req, res) {
    req.logout();
    res.send("logOut")
});

//All of the Routes gets collected here

require('./users')(router);
require('./role')(router);
require('./mailer')(router);
require('./security')(router);
require('./user_profile')(router);
require('./user_documents')(router);
require('./reset_password')(router);
require('./bankdetails')(router);
require('./history')(router);
require('./bitstamp_graph')(router);
require('./coin_balance')(router);
require('./transaction')(router);

//All of the Schema Collected here
require('../models/models');

module.exports = router;