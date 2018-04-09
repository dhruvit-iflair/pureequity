
var verify = require('../config/jwt');
var controller = require('../controller/users');

module.exports = function (router) {

    router.get('/api/users', verify, controller.get);

    router.get('/api/users/:id', verify, controller.getById);
    
    router.post('/api/users/verify', controller.verify);

    router.post('/api/users/image', controller.image);
    
    router.put('/api/users/:id', verify, controller.put);
    
    router.delete('/api/users/:id', verify, controller.delete);

    router.post('/api/users/totp', controller.verifyotp);
        
}