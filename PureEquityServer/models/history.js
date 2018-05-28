var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var History = new Schema({
    transactions: [{
        transaction_type:String,
        time:{ type: Date, default: Date.now },
        account: String,
        amount :{
            amount: Number,
            currency:String
        },
        value :{
            amount: Number,
            currency:String
        },
        rate : {
            amount: Number,
            currency:String
        },
        fees :{
            amount: Number,
            currency:String
        }
    }],
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('history', History);