var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    role: { type: Schema.Types.ObjectId, ref: 'role' },
    user_profile: { type: Schema.Types.ObjectId, ref: 'user_profile' },
    image: String,
    confirmationCode: String,
    isVerifyMobile: { type: Boolean, default: false },
    isVerifyEmail: { type: Boolean, default: false },
    is2FAEnabled: { type: Boolean, default: false },
    token: { type: Schema.Types.Mixed, default: '' },
    tokentime: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'user' }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', User);