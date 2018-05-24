import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { User } from '../../../shared/interfaces/user.interface';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles:[
    `.user-profile .profile-img img {
        width: 100%;
        border-radius: 100%;
        height: 50px;
    }`]
})
export class AppSidebarComponent {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  user:User;
  public picPoint = environment.picPoint + '/users/profileImage/';  
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public menuItems: MenuItems, public router:Router) {
    var u = JSON.parse(localStorage.getItem('token'));
    this.user = u.user;
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  };
  goToProfile(){
    this.router.navigate(['/users/edit/'+ this.user._id])
  }
}