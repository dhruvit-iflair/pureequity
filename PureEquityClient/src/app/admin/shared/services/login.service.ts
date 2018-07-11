import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../../environments/environment";
import { User } from '../interfaces/user.interface';
@Injectable()
export class LoginService {
    
    constructor(public http:HttpClient){}
    login(cred:any){
        return this.http.post(environment.login,cred);
    }
    register(data:User){
        return this.http.post(environment.register,data);
    }
    forget(email : String){
        return this.http.get(environment.api + '/reset_password/'+email);
    }
    verifyToken(token : String){
        return this.http.get(environment.api + '/reset_password/token/'+token);
    }
    changePassword(data : any){
        return this.http.post(environment.api + '/reset_password',data);
    }
    verifyAccount(data : any){
        return this.http.post(environment.api + '/users/verify',data);
    }
    contact(data : any){
        return this.http.post(environment.api + '/mails/send',data);
    }
}