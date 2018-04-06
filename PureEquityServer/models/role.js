var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Role = new Schema({
    name            : String,
    created_at      : { type: Date, default:Date.now },
    updated_at      : { type: Date, default:Date.now },
    createdBy       : { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy       : { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('role', Role);