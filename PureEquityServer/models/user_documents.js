var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User_Documents = new Schema({
    user: { type:Schema.Types.ObjectId, ref: 'user' },
    idType: String,
    idNumber:String,
    scandoc:Schema.Types.Mixed,
    deletedscandoc:Schema.Types.Mixed,
    issueCountry:String,
    issueDate:Date,
    trn:String,
    isApproved:{type: Boolean, default: false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('user_documents', User_Documents);