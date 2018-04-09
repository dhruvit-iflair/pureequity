import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditUserComponent } from '../edit-user.component';
import { User } from '../../../../shared/interfaces/user.interface';
import { Role } from '../../../../shared/interfaces/role.interface';
import { RoleService } from '../../../../shared/services/role.service';
import { UsersService } from '../../../../shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html',
  styleUrls: ['./user-personal-details.component.scss']
})
export class UserPersonalDetailsComponent implements OnInit {
  @Input() personalDetailsFormGroup : FormGroup;
  roles: Role[];
  picPoint = environment.picPoint + '/users/profileImage/';
  // public dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) public user: User
  constructor( public roleService: RoleService, public userService: UsersService, public toster: ToastrService) {
    this.roleService.getAllRoles();
    // this.dialogRef.afterOpen().subscribe(() => {
    //   (this.user.user_profile)?this.personalDetailsFormGroup.patchValue(this.user.user_profile):null;
    // })
  }
  ngOnInit() {
  }
}