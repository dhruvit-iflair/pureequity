import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import { Role } from "../interfaces/role.interface";
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class RoleService {
    public roles = new Subject<Role[]>();
    public role = new Subject<Role>();
    constructor(public http:HttpClient,private snakebar:MatSnackBar, public toster:ToastrService){}

    getAllRoles(){
        this.http.get(environment.api+'/role').subscribe((response:Role[])=>{
            this.roles.next(response);
        },(error)=>{
      this.snakebar.open('Error in getting roles please contact your system admin','',{duration: 5000});            
            // this.toster.error('Error in getting roles please contact your system admin', 'Error');
            console.log(error);
        })
    }
    getRoles():Observable<Role[]>{
        return this.roles.asObservable();
    }
    getARole(id:any){
        this.http.get(environment.api+'/role/'+id).subscribe((response:Role)=>{
            this.role.next(response);
        },(error)=>{
      this.snakebar.open('Error in getting roles please contact your system admin','',{duration: 5000});                        
            // this.toster.error('Error in getting role please contact your system admin', 'Error');
            console.log(error);
        })
    }
    getRole():Observable<Role>{
        return this.role.asObservable();
    }
}