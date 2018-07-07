var GraphCtrl = function () { }
var mongoose = require("mongoose")
var Graph = require('../models/bitstamp_graph');

GraphCtrl.prototype.get = function (req, res, next) {

    Graph.find().exec(function (err, doc) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        else if (doc && doc.length) {
            res.status(200).send(doc).end();
        }
        else if(!doc.length || doc == null || doc == [] || doc == undefined ){
            res.status(404).send({ message: "No Graph Found !!" }).end();
        }
        else {
            res.status(500).send({ message: "Error in getting Graphs" }).end();
        }
    });

}


GraphCtrl.prototype.getById = function (req, res, next) {

    Graph.findById(req.params.id).exec(function (err, doc) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            else if (doc && doc._id) {
                res.status(200).send(doc).end();
            }
            else if (!doc) {
                res.status(404).send({ message: "No Graph Found !!" }).end();
            }
            else {
                res.status(500).send({ message: "Error in getting this Graph!!" }).end();
            }
        });

}

module.exports = new GraphCtrl();
