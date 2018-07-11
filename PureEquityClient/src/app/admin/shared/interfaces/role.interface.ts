import { User } from './user.interface'

export interface Role {
    _id             : String,    
    name            : String,
    created_at      : Date,
    updated_at      : Date,
    createdBy       : User,
    updatedBy       : User,
}