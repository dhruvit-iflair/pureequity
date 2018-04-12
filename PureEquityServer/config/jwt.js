var jwt = require('jsonwebtoken');
var config = require('./config');

module.exports = function (req,res,next) {
    var token = req.headers['Authorization'] || req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'Account Details not found.' });
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate user. Please Login' });
        next();
    });
};