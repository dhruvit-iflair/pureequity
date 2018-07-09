var verify = require('../config/jwt');
var controller = require('../controller/bitstamp_graph');

module.exports = function (router) {

    router.get('/api/graph', controller.get);

    router.get('/api/graph/:id', controller.getById);
            
}