import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AuthGuard } from './shared/guard/auth.guard';

export const AppRoutes: Routes = [{
  path: '',
  component: FullComponent,
  children: [{
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: './pages/users/users.module#UsersModule'
  }, {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: './dashboards/dashboards.module#DashboardsModule'
  }
  ]
}, {
  path: '',
  component: AppBlankComponent,
  children: [{
    path: '',
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  }]
},
{
  path: '**',
  redirectTo: 'authentication/404'
}];
