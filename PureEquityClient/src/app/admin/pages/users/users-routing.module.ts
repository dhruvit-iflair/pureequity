import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ProfileComponent } from './profile/profile.component';


export const UsersRouting: Routes = [
  {
    path: '',
    component: UsersComponent
  },
  {
    path: ':id',
    component: ProfileComponent
  },{
    path: '**',
    redirectTo: '404'
  }
];