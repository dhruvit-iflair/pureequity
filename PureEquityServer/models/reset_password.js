var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reset_Password = new Schema({
    token: String,
    tokentime: Date,
    isUsed: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('reset_password', Reset_Password);