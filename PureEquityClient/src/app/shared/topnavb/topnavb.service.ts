import { Injectable } from '@angular/core';
const navItems=[
  {
    state: 'dashboard',
    title: 'Dashboard',
    icon: 'av_timer'
  },
  {
    state: 'kyc',
    title: 'KYC',
    icon: 'perm_contact_calendar'
  },
  {
    state: 'bank',
    title: 'Bank',
    icon: 'no_encryption'
  },
  {
    state: 'security',
    title: 'Security',
    icon: 'fingerprint'
  }
];
@Injectable()
export class TopnavbService {

  constructor() {
    return navItems;
   }

}
