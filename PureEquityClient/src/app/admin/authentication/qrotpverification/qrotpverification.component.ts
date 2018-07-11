import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-qrotpverificationx',
  templateUrl: './qrotpverification.component.html',
  styleUrls: ['./qrotpverification.component.css']
})
export class QrotpverificationComponentx implements OnInit {
  public veryform: FormGroup;
  constructor(private fb: FormBuilder, private http:Http ,private snakebar:MatSnackBar, private router: Router, public loginService: LoginService, private toastr: ToastrService) { }
  qr = { img: '', key: '' }; isqrenable = false;
  ngOnInit() {
    this.veryform = this.fb.group({
      totp: [null, Validators.compose([Validators.required])]
    });
    var tokendata = JSON.parse(localStorage.getItem('token'));
    if (tokendata) {
      this.qr.key = tokendata.data.twofactor.tempSecret;
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
      this.snakebar.open('Invalid OTP','',{duration: 5000});
      //this.toastr.error('Invalid OTP', 'Error');
      }
    });
    
  }
}
