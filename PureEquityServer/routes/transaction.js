var verify = require('../config/jwt');
var controller = require('../controller/transaction');

module.exports = function (router) {

    router.get('/api/transaction', controller.get);

    router.get('/api/transaction/user/:id', controller.getByUserId);

    router.get('/api/transaction/:id', controller.getById);
    
    router.post('/api/transaction', controller.post);

    router.put('/api/transaction/:id', controller.put);
    
    router.delete('/api/transaction/:id', controller.delete);
        
}