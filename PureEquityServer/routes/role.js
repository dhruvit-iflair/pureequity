var verify = require('../config/jwt');
var controller = require('../controller/role');

module.exports = function (router) {

    router.get('/api/role', controller.get);

    router.get('/api/role/:id', controller.getById);
    
    router.post('/api/role', controller.post);

    router.put('/api/role/:id', controller.put);
    
    router.delete('/api/role/:id', controller.delete);
        
}