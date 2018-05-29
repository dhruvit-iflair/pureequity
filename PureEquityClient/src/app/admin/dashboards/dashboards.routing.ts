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
import { BankComponent } from './bank/bank.component';
import { AdminGuard } from '../shared/guard/admin.guard';
import { UserGuard } from '../shared/guard/user.guard';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { ReportsComponent } from '../pages/reports/reports.component';
import { ReviewTransactionsComponent } from '../pages/review-transactions/review-transactions.component';

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
      canActivate:[UserGuard],
      component: KycComponent
    },
    {
      path: 'kyc/:id', 
      canActivate:[UserGuard],      
      component: KycAdminComponent
    },
    // {
    //   path: 'kycadmin', 
    //   canActivate:[UserGuard],      
    //   component: KycadminComponent
    // },
    {
      path:'bank',
      canActivate:[UserGuard],      
      component:BankComponent
    },
    {
      path:'admin',
      canActivate:[AdminGuard],
      children:[ {
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
        path: 'kyc', 
        component: KycadminComponent
      },
      {
        path: 'kyc/:id', 
        component: KycAdminComponent
      },
      {
        path:'security',
        component:QrotpverificationComponent,       
      }
     ]
    },
    {
      path:'buysell',
      canActivate:[UserGuard],      
      component:BuysellComponent
    },
    {
      path:'security',
      canActivate:[UserGuard],      
      component:QrotpverificationComponent,
      // children:[
      //   {
      //     path:'change-password',
      //     component:ChangePasswordComponent
      //   }
      // ]
    },
    {
      path:'deposit',
      canActivate:[UserGuard],      
      component:DepositComponent
    },
    {
      path:'withdrawal',
      canActivate:[UserGuard],      
      component:WithdrawalComponent
    },
    {
      path:'reports',
      canActivate:[UserGuard],      
      component:ReportsComponent
    },
    {
      path:'review-transactions',
      canActivate:[UserGuard],      
      component:ReviewTransactionsComponent
    },
  ]
  },
  {
    path: '**',
    redirectTo: '404'
  }
];