import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import {MatSnackBar} from '@angular/material';
import { CustomValidators } from 'ng2-validation';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, public loginService: LoginService, private toastr: ToastrService, private snakebar:MatSnackBar ,private globalService:GlobalService) { }

  ngOnInit() {
    //this.qr={img:'',key:''};
    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required, CustomValidators.email])], password: [null, Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    this.loginService.login(this.form.value).subscribe((response: any) => {
      if (response.user.isVerifyEmail) {
        var responsedata=response;
        responsedata.user.pwd=this.form.value.password;
          localStorage.setItem('token',JSON.stringify(responsedata));
          // this.toastr.success('Welcome!!', 'Success');
          this.snakebar.open('Successfully Logged in!','',{duration: 5000});
          this.globalService.collectCommonData(responsedata);
           if(responsedata.user.is2FAEnabled){
             this.router.navigate ( [ '/verification' ] );
           }
           else{
            this.router.navigate ( [ '/dashboard' ] );
          }
      }
      else{
        this.snakebar.open('Email not verified ! Please Verify your Email','',{duration: 5000});
        // this.toastr.warning('Email not verified ! Please Verify your Email', 'Warning');  
      }
    }, (error) => {
      this.snakebar.open('Username/Password is incorrect','',{duration: 5000});     
      // this.toastr.error('Username/Password is incorrect', 'Error');
      console.log(error);
    });
  }

}
