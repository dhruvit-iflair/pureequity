var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MoneyBalanceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    balance : [{
        coin:String,
        balance:Number,
        _id:false,
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('money_balances', MoneyBalanceSchema);