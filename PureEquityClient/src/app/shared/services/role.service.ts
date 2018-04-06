import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import { Role } from "../interfaces/role.interface";
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class RoleService {
    public roles = new Subject<Role[]>();
    constructor(public http:HttpClient, public toster:ToastrService){}

    getAllRoles(){
        this.http.get(environment.api+'/role').subscribe((response:Role[])=>{
            this.roles.next(response);
        },(error)=>{
            this.toster.error('Error in getting roles please contact your system admin', 'Error');
            console.log(error);
        })
    }
    getRoles():Observable<Role[]>{
        return this.roles.asObservable();
    }
}