import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { KycComponent } from './kyc/kyc.component';

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
    }
  ]
  }
];