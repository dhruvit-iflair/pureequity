import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar } from '@angular/material';
import { User } from '../../../shared/interfaces/user.interface';
import { RoleService } from '../../../shared/services/role.service';
import { Role } from '../../../shared/interfaces/role.interface';
import { UsersService } from '../../../shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { User_Profile } from '../../../shared/interfaces/user_profile.interface';
const reg = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {

  isLinear = true;
  detailsFormGroup: FormGroup;
  // personalDetailsFormGroup: FormGroup;
  roles: Role[];
  picPoint = environment.picPoint + '/users/profileImage/';
  click: Boolean = false;
  //user: User;

  constructor(private _formBuilder: FormBuilder,private snakebar:MatSnackBar, public roleService: RoleService, public userService: UsersService, public toster: ToastrService, public act: ActivatedRoute, public router: Router, public dialogRef: MatDialogRef<EditUserComponent>, @Inject(MAT_DIALOG_DATA) public user: User) {
    this.roleService.getAllRoles();
    //  this.act.params.subscribe((params) => {
    //    if(params.id)
    //    this.userService.getAUsers(params.id)
    //  });
  }
  cancel(){
    this.dialogRef.close();
  }
  ngOnInit() {
    this.detailsFormGroup = this._formBuilder.group({
      _id: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
      role: [null, Validators.required],
      image: [''],
      user_profile: this._formBuilder.group({
        personal: this._formBuilder.group({
          middleName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(15)])],
          placeOfBirth: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(25)])],
          gender: ['', Validators.required],
          countryCode: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(4)])],
          contactNumber: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(15)])],
          socialLink: ['', Validators.compose([Validators.required, Validators.pattern(reg)])]
        }),
        address: this._formBuilder.group({
          apartment: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
          streetAddress: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
          city: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
          country: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(20)])],
          zipcode: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)])],
        }),
        created_at: [{ value: null, disabled: true }],
        updated_at: [{ value: null, disabled: true }],
        createdBy: [null],
        updatedBy: [null]
      }),
      isVerifyMobile: [{ value: false, disabled: true }],
      isVerifyEmail: [{ value: false, disabled: true }],
      created_at: [{ value: null, disabled: true }],
      updated_at: [{ value: null, disabled: true }],
    });
    this.detailsFormGroup.valueChanges.subscribe((res) => {
      // console.log(res);
    })
    this.userService.getUser().subscribe((user) => {
      // console.log(user);
      this.user = user;
      this.detailsFormGroup.patchValue(this.user);
      this.detailsFormGroup.patchValue({ role: this.user.role._id });
      // (this.user.user_profile)?this.personalDetailsFormGroup.patchValue(this.user.user_profile):null;
    })
    this.roleService.getRoles().subscribe((r) => {
      this.roles = r;
    })
  }
  updateUserDetails() {
    this.detailsFormGroup.patchValue({ updated_at: Date.now() });
    var cred = JSON.parse(localStorage.getItem('token'));
    (this.detailsFormGroup.value.createdBy) ? this.detailsFormGroup.patchValue({ createdBy: cred.user._id }) : this.detailsFormGroup.patchValue({ updatedBy: cred.user._id, createdBy: cred.user._id });
    var data = this.detailsFormGroup.value;
    data.user_profile = this.user.user_profile._id;
    this.userService.updateUserDetails(data).subscribe((res) => {
      this.snakebar.open('User Details has been updated','',{duration: 5000});
      // this.toster.success('User Details has been updated', 'Success');
      this.userService.getAllUsers();
      this.click = true;
      this.cancel();
      this.router.navigate(['/admin/users']);
    }, (error) => {
      console.log(error);
      this.click = true;
      this.snakebar.open((error.error['message']) ? error.error.message : error.error,'',{duration: 5000});
      // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
      // this.router.navigate(['/users']);
    })
  }
  save(){
    if (!this.click) {
      this.click = false;
      this.detailsFormGroup.patchValue({ user_profile:{ updated_at: Date.now() }});
      var cred = JSON.parse(localStorage.getItem('token'));
      (this.detailsFormGroup.value.user_profile.createdBy)? this.detailsFormGroup.patchValue({ user_profile:{ updatedBy: cred.user._id }}) : this.detailsFormGroup.patchValue({ user_profile:{ createdBy: cred.user._id, updatedBy: cred.user._id }});
      var data = this.detailsFormGroup.value.user_profile;
      (this.user.user_profile)?(this.user.user_profile._id)? data._id = this.user.user_profile._id:null:null;
      this.userService.updateUserProfileDetails(data).subscribe((res:User_Profile)=>{
        this.user.user_profile = res;
        this.updateUserDetails();
      }, (error) => {
        console.log(error);
        this.snakebar.open((error.error['message']) ? error.error.message : error.error,'',{duration: 5000});
        // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
      });
    }
  }
  gotoKYC(){
    this.cancel();
    this.router.navigate(['/admin/kyc/'+ this.user._id]);
  }
}



// providers:[{
//   provide: NG_VALUE_ACCESSOR,
//   multi: true,
//   useExisting: forwardRef(() => EditUserComponent),
// }]
