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
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @Input() detailsFormGroup : FormGroup;
  roles: Role[];
  picker:any;
  picPoint = environment.picPoint + '/users/profileImage/';
  // public dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) public user: User,
  constructor( public roleService: RoleService, public userService: UsersService, public toster: ToastrService) {
    this.roleService.getAllRoles();
    // this.dialogRef.afterOpen().subscribe(() => {
    //   this.detailsFormGroup.patchValue(this.user);
    //   this.detailsFormGroup.patchValue({ role: this.user.role._id });
    // })
    this.roleService.getRoles().subscribe((r) => {
      this.roles = r;
    })
  }
  ngOnInit() {
  }
  editImage(event) {
    console.log("imaghe")
    this.userService.imageUpload(event).subscribe((response) => {
      this.detailsFormGroup.patchValue(response);
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
    });
  };
}
