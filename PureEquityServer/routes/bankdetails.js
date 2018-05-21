var verify = require('../config/jwt');
var controller = require('../controller/bankdetails');

module.exports = function (router) {

    router.get('/api/bankdetails', controller.get);

    router.get('/api/bankdetails/user/:id', controller.getByUserId);

    router.get('/api/bankdetails/:id', controller.getById);
    
    router.post('/api/bankdetails', controller.post);

    router.put('/api/bankdetails/:id', controller.put);
    
    router.delete('/api/bankdetails/:id', controller.delete);
        
}