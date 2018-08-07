var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoinTransactionSchema = new Schema({

    id: String,
    type: String,
    transaction_type: String,
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    paymentToken: String,
    orderID: String,
    payerID: String,
    paymentID: String,
    intent: String,
    status: String,
    error: String,
    billingID: String,
    cancelUrl: String,
    time: { type: Date, default: Date.now },
    account: String,
    amount: {
        amount: Number,
        currency: String
    },
    price:{
        price:Number,
        currency: String
    },
    value: {
        amount: Number,
        currency: String
    },
    subtotal:{
        amount: Number,
        currency: String        
    },
    rate: {
        amount: Number,
        currency: String
    },
    fees: {
        amount: Number,
        currency: String
    },
    datetime:Date,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('coin_transactions', CoinTransactionSchema);