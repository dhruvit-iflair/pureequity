var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Mailer = new Schema({
    title            : String,
    subject         :   String,
    content         :   Schema.Types.Mixed,
    created_at      : { type: Date, default:Date.now },
    updated_at      : { type: Date, default:Date.now },
    createdBy       : { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy       : { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('mails', Mailer);