var verify = require('../config/jwt');
var controller = require('../controller/money_balance');

module.exports = function (router) {

    router.get('/api/money_balance', controller.get);

    router.get('/api/money_balance/user/:id', controller.getByUserId);

    router.get('/api/money_balance/:id', controller.getById);
    
    router.post('/api/money_balance', controller.post);

    router.put('/api/money_balance/:id', controller.put);
    
    router.delete('/api/money_balance/:id', controller.delete);
        
}