var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Graph = new Schema({
    coin            : String,
    timestamp       : String,
    openPrice       : String,
    updated_at      : Date,
	created_at      : Date
});


module.exports = mongoose.model('bitstamp_graphs', Graph);