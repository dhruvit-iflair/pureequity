import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { KycComponent } from './kyc/kyc.component';
import { KycadminComponent } from './kycadmin/kycadmin.component';
import { KycAdminComponent } from './kyc/kycadmin.component';
import { BankdetailsComponent } from './bankdetails/bankdetails.component';
import { QrotpverificationComponent } from './qrotpverification/qrotpverification.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';
import { MailerComponent } from './mailer/mailer.component';
import { MaillistComponent } from './mailer/maillist/maillist.component';
import { RolesComponent } from './roles/roles.component';
import { RoleComponent } from './roles/role/role.component';
import { BuysellComponent } from './buysell/buysell.component';

export const DashboardsRoutes: Routes = [
 { 
    path: '',
    children: [{
      path: 'dashboard', 
      component: Dashboard1Component
    }
    // },
    ,{
      path: 'kyc', 
      component: KycComponent
    },
    {
      path: 'kyc/:id', 
      component: KycAdminComponent
    },
    {
      path: 'kycadmin', 
      component: KycadminComponent
    },
    {
      path:'bank',
      component:BankdetailsComponent
    },
    {
      path:'mails',
      component:MaillistComponent
    },
    {
      path:'mail',
      component:MailerComponent
    },
    {
      path:'mail/:id',
      component:MailerComponent
    },
    {
      path:'roles',
      component:RolesComponent
    },
    {
      path:'role',
      component:RoleComponent
    },
    {
      path:'role/:id',
      component:RoleComponent
    },
    {
      path:'buysell',
      component:BuysellComponent
    },
    {
      path:'security',
      component:QrotpverificationComponent,
      // children:[
      //   {
      //     path:'change-password',
      //     component:ChangePasswordComponent
      //   }
      // ]
    }
  ]
  }
];