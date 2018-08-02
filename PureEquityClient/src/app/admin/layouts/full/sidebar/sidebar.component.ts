import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { User } from '../../../shared/interfaces/user.interface';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { UsersService } from '../../../shared/services/users.service';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styles: [
        `.user-profile .profile-img img {
        width: 100%;
        border-radius: 100%;
        height: 50px;
    }`]
})
export class AppSidebarComponent implements OnInit{
    public config: PerfectScrollbarConfigInterface = {};
    mobileQuery: MediaQueryList;
    user: User;
    public sub:any;
    public picPoint = environment.picPoint + '/users/profileImage/';
    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public menuItems: MenuItems, public router: Router, public userService: UsersService) {
        this.mobileQuery = media.matchMedia('(min-width: 768px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    ngOnInit(){
        var u = JSON.parse(localStorage.getItem('token'));
        // this.user = u.user;
        this.userService.currentUser.subscribe(user => {
            this.user = user;
        })
        this.userService.updateCurrentUser(u.user);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    };
    goToProfile() {
        this.router.navigate(['/admin/users/' + this.user._id])
    }
}
