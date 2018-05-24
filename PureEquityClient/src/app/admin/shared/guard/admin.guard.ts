import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GlobalService } from "../services/global.service";
import { Location } from '@angular/common';

@Injectable()
export class AdminGuard implements CanActivate {
    public role:any;
    constructor(private globalService:GlobalService, private location:Router){
        this.globalService.roleStatus().subscribe((role)=>{
            this.role = role;
            console.log(role);
        })
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        console.log("admin gurd");
        console.log(this.role);
        var cred = JSON.parse(localStorage.getItem('token'));
        console.log(cred);
        if (!cred || !(cred.user.role.name == 'admin') ) {
            localStorage.clear();
            this.location.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }
}
