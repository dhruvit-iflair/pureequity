var controller = require('../controller/reset_password');

module.exports = function (router) {

    router.get('/api/reset_password/token/:token', controller.getByToken);
    
    router.get('/api/reset_password/:email', controller.generate);

    router.post('/api/reset_password', controller.verify);

}