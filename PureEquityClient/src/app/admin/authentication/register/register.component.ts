import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/interfaces/role.interface';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup; isvalidcapcha;
  public roles: Array<Role> = [];
  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService, public roleService: RoleService, public toster: ToastrService,private snakebar:MatSnackBar) {
    this.roleService.getAllRoles();
  }
  data = {}; imgurl;
  ngOnInit() {
    const password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)]));
    const confirmPassword = new FormControl('', Validators.compose([CustomValidators.equalTo(password), Validators.minLength(6), Validators.maxLength(15)]));

    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      username: [null, Validators.compose([Validators.required, CustomValidators.email])],
      firstName: ['', Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(15)])],
      lastName: ['', Validators.compose([Validators.required,Validators.minLength(2), Validators.maxLength(15)])],
      isVerifyMobile: [false],
      role: ['', Validators.compose([Validators.required])],
      isVerifyEmail: [false],
      password: password,
      confirmPassword: confirmPassword,
      isAgreed: ['', Validators.required],
      isvalidcapcha: ['',Validators.required]
    });
    this.roleService.getRoles().subscribe((role: Role[]) => {
      this.roles = role;
      var roleID = this.roles.filter((r) => {
        return r.name == 'user'
      });
      this.form.patchValue({ role: roleID[0]._id });
    });
    this.form.controls['email'].valueChanges.subscribe((data) => {
      this.form.patchValue({ username: data });
    })
  }
  resolved(captchaResponse: string) {
    this.isvalidcapcha = captchaResponse;
    console.log(captchaResponse);
    if(this.isvalidcapcha){
      this.form.patchValue({isvalidcapcha:captchaResponse});
    }
  }
  onSubmit() {
    if (this.isvalidcapcha) {
      this.loginService.register(this.form.value).subscribe((response) => {
        //this.toster.success(response['message'], 'Success');
        this.snakebar.open(response['message'],'',{duration: 5000});
        this.router.navigate(['/login']);
      }, (error) => {
        console.log(error);
        this.snakebar.open((error.error['message']) ? error.error.message : error.error,'',{duration: 5000});
       // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
      })
    }
  }
}
