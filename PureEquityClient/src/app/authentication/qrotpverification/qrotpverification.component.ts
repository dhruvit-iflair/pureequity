import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-qrotpverification',
  templateUrl: './qrotpverification.component.html',
  styleUrls: ['./qrotpverification.component.css']
})
export class QrotpverificationComponent implements OnInit {
  public veryform: FormGroup;
  constructor(private fb: FormBuilder, private http:Http , private router: Router, public loginService: LoginService, private toastr: ToastrService) { }
  qr = { img: '', key: '' }; isqrenable = false;
  ngOnInit() {
    this.veryform = this.fb.group({
      totp: [null, Validators.compose([Validators.required])]
    });
    var tokendata = JSON.parse(localStorage.getItem('token'));
    if (tokendata) {
      var obj = { username: tokendata.user.username, password: tokendata.user.pwd };
      this.loginService.login(obj).subscribe((response: any) => {
        if (response.user.isVerifyEmail) {
          this.qr.img = response.data.twofactor.dataURL;
          this.qr.key = response.data.twofactor.tempSecret;
          this.isqrenable = true;
        }
        else {
          this.toastr.warning('Email not verified ! Please Verify your Email', 'Warning');
        }
      }, (error) => {
        this.toastr.error('Username/Password is incorrect', 'Error');
        console.log(error);
      });
    }
   }
  verifyotp(){
    var uobj={
      totp:this.veryform.value.totp,
      key:this.qr.key
    };
    this.http.post(environment.api+'/users/totp',uobj)
    .subscribe((resp:any)=>{
      var x=resp.json();
      if(x.verificationstatus=='success'){
        this.router.navigate(['/dashboard']);
      }
    },(err)=>{
      var x=err.json();
      if(x.verificationstatus!='success'){
      this.toastr.error('Invalid OTP', 'Error');
      }
    });
    
  }
}
