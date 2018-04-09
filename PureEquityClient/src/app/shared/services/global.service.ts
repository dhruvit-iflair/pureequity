import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { RoleService } from './role.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { UsersService } from './users.service';

@Injectable()
export class GlobalService {
  private currentRole = new Subject<any> ();
  constructor(private roleService:RoleService, private userService:UsersService) {
    this.roleService.getAllRoles();
    this.roleService.getRole().subscribe((res)=>{
      localStorage.setItem('role',JSON.stringify(res));
      this.currentRole.next(res);
    })
    var data = JSON.parse(localStorage.getItem('token'));
    if (data) {
      this.collectCommonData(data);
    }
  }
  collectCommonData(data:any){
    this.roleService.getARole(data.user.role._id);
    if (data.user.role.name == "admin") {
      this.collectAdminData(data);
    } else {
      this.collectUserData(data); 
    }
  }
  collectAdminData(data:any){
    this.userService.getAllUsers();
  }
  collectUserData(data:any){
    console.log("Will collect");
  }
  roleStatus():Observable<any>{
    return this.currentRole.asObservable();
  }

}
