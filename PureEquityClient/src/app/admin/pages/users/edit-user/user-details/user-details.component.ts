import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { EditUserComponent } from '../edit-user.component';
import { User } from '../../../../shared/interfaces/user.interface';
import { Role } from '../../../../shared/interfaces/role.interface';
import { RoleService } from '../../../../shared/services/role.service';
import { UsersService } from '../../../../shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { Router, Params, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
    @Input() detailsFormGroup: FormGroup;
    roles: Role[];
    picker: any; isSameUser = false;
    picPoint = environment.picPoint + '/users/profileImage/';
    // public dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) public user: User,
    constructor(
        public roleService: RoleService,
        public aroute: ActivatedRoute,
        public userService: UsersService,
        public toster: ToastrService,
        private snakebar: MatSnackBar) {
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
        var token = JSON.parse(localStorage.getItem('token'));
        this.aroute.params.subscribe((params) => {
            if (token.user._id == params.id) {
                this.isSameUser = true;
            }
        });
    }
    editImage(event) {
        var file = event.target.files[0];;
        var reader = new FileReader();

        // this.userService.imageUpload(event).subscribe((response) => {
        //   this.detailsFormGroup.patchValue(response);
        // }, (error) => {
        //   console.log(error);
        //   this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
        // });
        if (file.type == 'image/png' || file.type == 'image/jpeg') {
            if (file.size > 200000 && file.size < 2000000) {
                var that = this;
                reader.onloadend = function () {
                    that.detailsFormGroup.patchValue({ image: reader.result });
                }
                reader.readAsDataURL(file);
            }
            else {
                this.snakebar.open('Image should be Min 200KB to Max 2MB ', '', { duration: 5000 });
            }
        }
        else {
            this.snakebar.open('Image should be in JPG, JPEG or PNG format ', '', { duration: 5000 });
        }
    };
}
