import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(public router:Router){}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        var cred = JSON.parse(localStorage.getItem('token'));
        if (!cred || !cred.token) {
            this.router.navigate(['/login']);
            return false;
        } else {
            return true;
        }
    }
}
