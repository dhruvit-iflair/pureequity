
var verify = require('../config/jwt');
var controller = require('../controller/security');

module.exports = function (router) {

    router.post('/api/security/setup', controller.setup);

    router.post('/api/security/totp', controller.verifyotp);
        
}