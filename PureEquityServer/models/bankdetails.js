var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bankdetails = new Schema({
    bankdetails: [{
        acnumber: String,
        ifscnumber: String,
        actype: String,
        name: String,
        bankdoctype: String,
        isagreed: String
    }],
    ccinfo: [{
        ccname: String,
        ccnumber: String,
        expmonth: String,
        expyear: String,
        cvvnumber: String
    }],
    ppdetails: [{
        email: String,
        pwd: String
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('bankdetails', Bankdetails);