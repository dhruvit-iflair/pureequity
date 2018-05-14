import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UsersRouting } from './users-routing.module';
import { UsersComponent } from "./users/users.component";
import { DemoMaterialModule } from '../../demo-material-module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog,MatDialogRef  } from '@angular/material/dialog';

import { FirstcapitalizePipe } from '../../shared/pipes/firstCapitalize.pipe';
import { PersonalAddressComponent } from './edit-user/user-personal-details/personal-address/personal-address.component';
import { PersonalDetailsComponent } from './edit-user/user-personal-details/personal-details/personal-details.component';
import { UserDetailsComponent } from './edit-user/user-details/user-details.component';
import { UserPersonalDetailsComponent } from './edit-user/user-personal-details/user-personal-details.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRouting),
    DemoMaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule, 
    FlexLayoutModule,
  ],
  declarations: [
    UsersComponent, 
    EditUserComponent,
    PersonalAddressComponent,
    PersonalDetailsComponent,
    UserDetailsComponent,
    UserPersonalDetailsComponent,
    ProfileComponent,
  ],
  entryComponents:[EditUserComponent]
})
export class UsersModule { }
