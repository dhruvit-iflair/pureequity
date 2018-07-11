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
        })
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        var cred = JSON.parse(localStorage.getItem('token'));
        if (!cred || !(cred.user.role.name == 'admin') ) {
            //localStorage.clear();
            this.location.navigate(['/404']);
            return false;
        } else {
            return true;
        }
    }
}
