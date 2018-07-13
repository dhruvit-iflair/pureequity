import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { AppHeaderComponent } from './header/header.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'; 
import { TopnavbService } from '../../shared/topnavb/topnavb.service';

declare var $: any;

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: [],
}) 
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green: boolean;
  blue: boolean;
  dark: boolean;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide:boolean;
  sidebarOpened;    
      
  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;
  public navItems;isAdmin;is2FAEnabled;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public menuItems: MenuItems,private topnav:TopnavbService) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.navItems=this.topnav;
  }
  ngOnInit(){
    var tokendata=JSON.parse(localStorage.getItem('token'));
    if(tokendata.user.role.name!='admin'){
      this.isAdmin=false;
      if(tokendata.user.is2FAEnabled){
        this.is2FAEnabled=true;
      }
      else{
        this.is2FAEnabled=false;
      }
    }
    else{
      this.isAdmin=true;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
 ngAfterViewInit() {
     //This is for the topbar search
     (<any>$(".srh-btn, .cl-srh-btn")).on('click', function () {
            (<any>$(".app-search")).toggle(200);
        });
     //This is for the megamenu
     
  }
    
  // Mini sidebar
  
   
}
