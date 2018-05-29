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
  },
  {
    state: 'deposit',
    title: 'Deposit',
    icon: 'attach_money'
  },
  {
    state: '404',
    title: 'Withdrawal',
    icon: 'money_off'
  },
  // {
  //   state: 'reports',
  //   title: 'Reports',
  //   icon: 'cloud_download'
  // },
  // {
  //   state: 'review-transactions',
  //   title: 'Review Transactions',
  //   icon: 'history'
  // }
  // {
  //   state: 'dashboard',
  //   title: 'Contact Us',
  //   icon: 'hearing'
  // }
];
@Injectable()
export class TopnavbService {

  constructor() {
    return navItems;
   }

}
