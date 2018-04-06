import { User } from "./user.interface";

export interface User_Profile {
    _id             : String,
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
    created_at      : Date,
    updated_at      : Date,
    createdBy       : User,
    updatedBy       : User
}
