import { Role } from "./role.interface";
import { User_Profile } from "./user_profile.interface";
export interface User {
    _id             : String,
    username        : String,
    firstName       : String,
    lastName        : String,
    role            : Role,
    user_profile    : User_Profile,
    image           : String,
    confirmationCode: String,
    isVerifyMobile  : Boolean,
    isVerifyEmail   : Boolean,
    token           : String,
    tokentime       : String,
    created_at      : Date,
    updated_at      : Date,
    createdBy       : User,
    updatedBy       : User
}
export interface Bank {
    _id?: String,
    bankdetails : {},
    ccinfo : {},
    ppdetails : {},
    created_at: any,
    updated_at: any,
    createdBy: any,
    updatedBy: any,
    user: String
}