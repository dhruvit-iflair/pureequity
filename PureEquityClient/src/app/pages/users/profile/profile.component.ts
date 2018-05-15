import { Component, OnInit, Input, Inject, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { User } from '../../../shared/interfaces/user.interface';
import { RoleService } from '../../../shared/services/role.service';
import { Role } from '../../../shared/interfaces/role.interface';
import { UsersService } from '../../../shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { Http } from "@angular/http";
import { environment } from "../../../../environments/environment";
import { ActivatedRoute, Router } from '@angular/router';
import { User_Profile } from '../../../shared/interfaces/user_profile.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,public provider:Http, public roleService: RoleService, public userService: UsersService, public toster: ToastrService, public act: ActivatedRoute, public router: Router) {
    this.roleService.getAllRoles();
    this.act.params.subscribe((params) => {
      this.uid=params.id;
    });
  }
  uid;
  detailsFormGroup: FormGroup;
  roles: Role[];
  picPoint = environment.picPoint + '/users/profileImage/';
  profiledata;
  ngOnInit() {
    this.detailsFormGroup = this._formBuilder.group({
      _id: ['', Validators.required],
      username: [{ value: '', disabled: true }, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: [null, Validators.required],
      image: ['', Validators.required],
      user_profile: this._formBuilder.group({
        personal: this._formBuilder.group({
          middleName: ['', Validators.required],
          placeOfBirth: ['', Validators.required],
          gender: ['', Validators.required],
          countryCode: ['', Validators.required],
          contactNumber: ['', Validators.required],
          socialLink: ['', Validators.required]
        }),
        address: this._formBuilder.group({
          apartment: ['', Validators.required],
          streetAddress: ['', Validators.required],
          city: ['', Validators.required],
          country: ['', Validators.required],
          zipcode: ['', Validators.required],
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
    
   this.provider.get(environment.api+'/users/'+this.uid).subscribe((resp)=>{
     var x=resp.json();
     this.detailsFormGroup.patchValue(x);
     this.detailsFormGroup.patchValue({ role: x.role._id });
     this.provider.get(environment.api+'/user_profile/getbyuid/'+this.uid).subscribe((respd)=>{
       this.profiledata=respd.json();
      var y=respd.json();
      this.detailsFormGroup.patchValue({user_profile:y[0]});
     });
   });
  }
  cancel(){
    window.history.back();
  }
  updateUserDetails(){
    this.detailsFormGroup.patchValue({ updated_at: Date.now() });
    var cred = JSON.parse(localStorage.getItem('token'));
    (this.detailsFormGroup.value.createdBy) ? this.detailsFormGroup.patchValue({ createdBy: cred.user._id }) : this.detailsFormGroup.patchValue({ updatedBy: cred.user._id, createdBy: cred.user._id });
    var data = this.detailsFormGroup.value;
    data.user_profile = this.profiledata._id;
    this.userService.updateUserDetails(data).subscribe((res) => {
      this.toster.success('User Details has been updated', 'Success');
      this.userService.getAllUsers();
      this.router.navigate(['/users']);
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
      // this.router.navigate(['/users']);
    })
  }
}
