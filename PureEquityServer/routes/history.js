var verify = require('../config/jwt');
var controller = require('../controller/history');

module.exports = function (router) {

    router.get('/api/history', controller.get);

    router.get('/api/history/user/:id', controller.getByUserId);

    router.get('/api/history/:id', controller.getById);
    
    router.post('/api/history', controller.post);

    router.put('/api/history/:id', controller.put);
    
    router.delete('/api/history/:id', controller.delete);
        
}