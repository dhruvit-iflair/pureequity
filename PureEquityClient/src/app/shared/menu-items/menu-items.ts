import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Role } from '../interfaces/role.interface';
import { RoleService } from '../services/role.service';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const ADMINMENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
  },
  {
    state: 'users',
    name: 'User Management',
    type: 'link',
    icon: 'av_timer',
  },
  {
    state: 'kyc',
    name: 'KYC',
    type: 'link',
    icon: 'perm_contact_calendar',
  }
];
const USERMENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
  },
  {
    state: 'kyc',
    name: 'KYC',
    type: 'link',
    icon: 'perm_contact_calendar',
  }
];

@Injectable()

export class MenuItems {
  public role: Role;
  constructor(public http: HttpClient, public toster: ToastrService, private roleService: RoleService) {
    var data = JSON.parse(localStorage.getItem('token'));
    this.roleService.getRole().subscribe((role) => {
      this.role = role;
    })
    if (data && data.user.role && !this.role) {
      this.roleService.getARole(data.user.role);
    }
  }

  getMenuitem(): Menu[] {
    if (this.role && this.role.name == 'admin') {
      return ADMINMENUITEMS;
    }
    else {
      return USERMENUITEMS;
    }
  }

}
