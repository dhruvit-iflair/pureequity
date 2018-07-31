import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from '../../../shared/interfaces/user.interface';
import { RoleService } from '../../../shared/services/role.service';
import { Role } from '../../../shared/interfaces/role.interface';
import { UsersService } from '../../../shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { User_Profile } from '../../../shared/interfaces/user_profile.interface';
import { CustomValidators } from 'ng2-validation';
const reg = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

    isLinear = true;
    form: FormGroup;
    roles: Role[];
    picPoint = environment.picPoint + '/users/profileImage/';
    click: Boolean = false;
    random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    countries = require('./countries.json');

    constructor(
        private _formBuilder: FormBuilder,
        private snakebar: MatSnackBar,
        public roleService: RoleService,
        public userService: UsersService,
        public toster: ToastrService,
        public act: ActivatedRoute,
        public router: Router,
        public dialogRef: MatDialogRef<NewUserComponent>,
        @Inject(MAT_DIALOG_DATA) public user: User) {
        this.roleService.getAllRoles();
    }
    cancel() {
        this.dialogRef.close();
    }
    ngOnInit() {
        this.form = this._formBuilder.group({
            username: ['', Validators.compose([Validators.required, CustomValidators.email])], //username: ['', [Validators.required, Validators.email]],
            password: [this.random.toString()],
            isVerifyEmail: [true],
            firstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
            lastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
            role: [null, Validators.required],
            image: [''],
            user_profile: this._formBuilder.group({
                personal: this._formBuilder.group({
                    middleName: ['', Validators.required],
                    placeOfBirth: ['', Validators.required],
                    gender: ['', Validators.required],
                    countryCode: ['', Validators.required],
                    contactNumber: ['', Validators.required],
                    socialLink: ['', Validators.compose([Validators.required, Validators.pattern(reg)])]
                }),
                address: this._formBuilder.group({
                    apartment: ['', Validators.required],
                    streetAddress: ['', Validators.required],
                    city: ['', Validators.required],
                    country: ['', Validators.required],
                    zipcode: ['', Validators.required],
                }),
            }),
        });
        this.form.valueChanges.subscribe((res) => {
            // console.log(res);
        })
        this.roleService.getRoles().subscribe((r) => {
            this.roles = r;
        })
    }
    editImage(event) {
        var file = event.target.files[0];;
        var reader = new FileReader();
        console.log(file.type);
        if (file.type == 'image/png' || file.type == 'image/jpeg') {
            if (file.size > 200000 && file.size < 2000000) {
                var that = this;
                reader.onloadend = function () {
                    that.form.patchValue({ image: reader.result });
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
    save() {
        let user_profile = this.form.controls.user_profile.value;
        let data = this.form.value;
        let token = JSON.parse(localStorage.getItem('token'));
        user_profile.createdBy = token.user._id;
        console.log(user_profile);
        this.userService.updateUserProfileDetails(user_profile).subscribe((us_pro: any) => {
            console.log(us_pro);
            data.user_profile = us_pro._id;
            this.userService.newUser(data).subscribe((response: any) => {
                console.log(response);
                this.userService.getAllUsers();
                this.cancel();
                this.snakebar.open('User Details has been created', '', { duration: 5000 });
            }, (error) => {
                console.log(error);
            });
        }, (error) => {
            this.snakebar.open((error.error['message']) ? error.error.message : error.error, '', { duration: 5000 });
            console.log(error);
        });
    }
}
