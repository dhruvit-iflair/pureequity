var verify = require('../config/jwt');
var controller = require('../controller/user_profile');

module.exports = function (router) {

    router.get('/api/user_profile', verify, controller.get);

    router.get('/api/user_profile/:id', verify, controller.getById);
    
    router.post('/api/user_profile', verify, controller.post);

    router.put('/api/user_profile/:id', verify, controller.put);
    
    router.delete('/api/user_profile/:id', verify, controller.delete);
        
}