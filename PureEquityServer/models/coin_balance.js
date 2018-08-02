var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoinBalance = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    balance : [{
        coin:String,
        balance:Number,
        _id:false,
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('coin_balances', CoinBalance);