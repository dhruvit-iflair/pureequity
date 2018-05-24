import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
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
    icon: 'dashboard',
  },
  {
    state: 'users',
    name: 'User Management',
    type: 'link',
    icon: 'av_timer',
  },
  {
    state: 'kycadmin',
    name: 'KYC',
    type: 'link',
    icon: 'perm_contact_calendar',
  },
  // {
  //   state: 'bank',
  //   name: 'Bank',
  //   type: 'link',
  //   icon: 'no_encryption',
  // },
  {
    state: 'security',
    name: 'Security',
    type: 'link',
    icon: 'fingerprint',
  },
  {
    state: 'mails',
    name: 'Mail Management',
    type: 'link',
    icon: 'widgets',
  },
  {
    state: 'roles',
    name: 'Role Management',
    type: 'link',
    icon: 'extension',
  }
];
const USERMENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'dashboard',
  },
  {
    state: 'kyc',
    name: 'KYC',
    type: 'link',
    icon: 'perm_contact_calendar',
  },
  // {
  //   state: 'bank',
  //   name: 'Bank',
  //   type: 'link',
  //   icon: 'no_encryption',
  // },
  {
    state: 'security',
    name: 'Security',
    type: 'link',
    icon: 'fingerprint',
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
      this.roleService.getARole(data.user.role._id);
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
