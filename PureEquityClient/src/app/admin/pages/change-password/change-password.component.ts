import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/interfaces/user.interface';
import { LoginService } from '../../shared/services/login.service';
import { card } from '../../shared/animations/animations';
import { MatSnackBar } from '@angular/material';

const current_password = new FormControl('', Validators.required);
const password = new FormControl('', [CustomValidators.notEqualTo(current_password), Validators.required]);
const confirmPassword = new FormControl('', [CustomValidators.notEqualTo(current_password), CustomValidators.equalTo(password), Validators.required]);

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  animations:[card]
})
export class ChangePasswordComponent implements OnInit {
  public form: FormGroup;
  public token: String;isChangePassword;
  public user: any;
  constructor(private fb: FormBuilder,private snakebar:MatSnackBar, private router: Router, private userService: UsersService, public loginService: LoginService, public toster: ToastrService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      current_password: current_password,
      password: password,
      confirmPassword: confirmPassword,
      username: ['', Validators.required],
      _id: ['', Validators.required]
    });
    var loc = JSON.parse(localStorage.getItem('token'));
    this.user = loc.user;
    this.form.patchValue(this.user);
  }
  onSubmit() {
    var cred = {
      username: this.form.value.username,
      password: this.form.value.current_password
    }
    this.loginService.login(cred).subscribe((res: any) => {
      if (res.auth) {
        this.userService.changePassword(this.form.value).subscribe((response) => {
          this.snakebar.open(response['message'],'',{duration: 5000});
          //this.toster.success(response['message'], 'Success');
          localStorage.clear();
          this.router.navigate(['/login']);
          // window.location.href = '/login';
        }, (error) => {
          console.log(error);
          this.snakebar.open((error.error['message']) ? error.error.message : error.error,'',{duration: 5000});          
          // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
        })
      } else {
        this.snakebar.open('Current Password not matched','',{duration: 5000});        
        // this.toster.error("Current Password not matched", 'Error');
      }
    }, (error) => {
      this.snakebar.open('Current Password not matched','',{duration: 5000});        
      // this.toster.error("Current Password not matched", 'Error');
    })
  }
}
