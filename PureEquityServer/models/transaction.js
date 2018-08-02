var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
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
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('transactions', TransactionSchema);