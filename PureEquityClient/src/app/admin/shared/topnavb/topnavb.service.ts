import { Injectable } from '@angular/core';
const navItems=[
  {
    state: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard'
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
    state: 'buysell',
    title: 'Buy/Sell',
    icon: 'import_export'
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
