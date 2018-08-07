var verify = require('../config/jwt');
var controller = require('../controller/coin_transaction');

module.exports = function (router) {

    router.get('/api/coin_transaction', controller.get);

    router.get('/api/coin_transaction/user/:id', controller.getByUserId);

    router.get('/api/coin_transaction/:id', controller.getById);
    
    router.post('/api/coin_transaction', controller.post);

    router.put('/api/coin_transaction/:id', controller.put);
    
    router.delete('/api/coin_transaction/:id', controller.delete);
        
}