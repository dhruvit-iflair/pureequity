var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User_Profile = new Schema({
    name            : String,
    personal  : {
        firstName    :String,
        middleName   :String,
        placeOfBirth :String,
        gender       :String,
        countryCode  :String,
        contactNumber:String,
        socialLink   :String
    },
    address   : {
        country      :String,
        zipcode      :String,
        city         :String,
        streetAddress:String,
        apartment    :String,
    },
    created_at      : { type: Date, default:Date.now },
    updated_at      : { type: Date, default:Date.now },
    createdBy       : { type: Schema.Types.ObjectId, ref: 'user' },
    updatedBy       : { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('user_profile', User_Profile);