import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/interfaces/role.interface';
import { ToastrService } from 'ngx-toastr';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;
  public roles: Array<Role> = [];
  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService, public roleService: RoleService, public toster: ToastrService) {
    this.roleService.getAllRoles();
  }
  data={};imgurl;
  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      username: [null, Validators.compose([Validators.required, CustomValidators.email])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      isVerifyMobile: [false],
      role: ['', Validators.compose([Validators.required])],
      isVerifyEmail: [false],
      password: password,
      confirmPassword: confirmPassword,
      isAgreed:[false]
    });
    this.roleService.getRoles().subscribe((role: Role[]) => {
      this.roles = role;
      var roleID = this.roles.filter((r) => {
        return r.name == 'user'
      });
      this.form.patchValue({ role: roleID[0]._id });
    });
    this.form.controls['email'].valueChanges.subscribe((data)=>{
      this.form.patchValue({username:data});
    })
  }

  onSubmit() {
    this.loginService.register(this.form.value).subscribe((response) => {
      this.toster.success(response['message'], 'Success');
      this.router.navigate ( [ '/login' ] );
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message'])? error.error.message : error.error, 'Error');
    })
  }
}
