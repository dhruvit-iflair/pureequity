var controller = require('../controller/mailer');

module.exports = function (router) {

    router.get('/api/mails', controller.get);

    router.get('/api/mails/:id', controller.getById);

    router.get('/api/mailsbytitle/:id',controller.getByTitle);
    
    router.post('/api/mails', controller.post);

    router.post('/api/mails/send', controller.send);

    router.put('/api/mails/:id', controller.put);
    
    router.delete('/api/mails/:id', controller.delete);
        
}