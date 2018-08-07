var verify = require('../config/jwt');
var controller = require('../controller/money_transaction');

module.exports = function (router) {

    router.get('/api/money_transaction', controller.get);

    router.get('/api/money_transaction/user/:id', controller.getByUserId);

    router.get('/api/money_transaction/:id', controller.getById);
    
    router.post('/api/money_transaction', controller.post);

    router.put('/api/money_transaction/:id', controller.put);
    
    router.delete('/api/money_transaction/:id', controller.delete);
        
}