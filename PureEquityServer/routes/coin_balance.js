var verify = require('../config/jwt');
var controller = require('../controller/coin_balance');

module.exports = function (router) {

    router.get('/api/coin_balance', controller.get);

    router.get('/api/coin_balance/user/:id', controller.getByUserId);

    router.get('/api/coin_balance/:id', controller.getById);
    
    router.post('/api/coin_balance', controller.post);

    router.put('/api/coin_balance/:id', controller.put);
    
    router.delete('/api/coin_balance/:id', controller.delete);
        
}