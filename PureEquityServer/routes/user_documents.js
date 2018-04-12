
var verify = require('../config/jwt');
var controller = require('../controller/user_documents');

module.exports = function (router) {

    router.get('/api/userdocs', controller.get);

    router.post('/api/userdocs/', controller.post);

    router.get('/api/userdocs/:id', controller.getById);
    
    router.patch('/api/userdocs/:id', controller.patcher);

    router.get('/api/userdocs/byuid/:id', controller.getByUid);

    router.post('/api/userdocs/image', controller.image);
    
    router.put('/api/userdocs/:id', controller.put);
    
    router.delete('/api/userdocs/:id', controller.delete);
        
}