import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/interfaces/role.interface';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public form: FormGroup;
  public token: String;
  public title : String = "Reset Password";
  constructor(private fb: FormBuilder, private router: Router, private active: ActivatedRoute, private loginService: LoginService, public toster: ToastrService,private snakebar:MatSnackBar) {
    this.active.queryParams.subscribe((params) => {
      // console.log(params);
      if (params && params['token']) {
        this.loginService.verifyToken(params.token).subscribe((res) => {
          this.token = params['token'];
        }, (err) => {
          //this.toster.error(err.error['message'], 'Error!!');
          this.router.navigate(['/forgot']);
        })
      } else {
        this.router.navigate(['/forgot']);
      }
      if(params['type']){
        this.title = "Set New Password";
      }

    })
  }

  ngOnInit() {
    this.form = this.fb.group({
      token: [''],
      password: password,
      confirmPassword: confirmPassword
    });
  }
  onSubmit() {
    this.form.patchValue({ token: this.token });
    this.loginService.changePassword(this.form.value).subscribe((response) => {
      //this.toster.success(response['message'], 'Success');
      this.snakebar.open(response['message'],'',{duration: 5000});      
      this.router.navigate(['/login']);
    }, (error) => {
      console.log(error);
      this.snakebar.open((error.error['message']) ? error.error.message : error.error,'',{duration: 5000});      
      //this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
    })
  }
}
