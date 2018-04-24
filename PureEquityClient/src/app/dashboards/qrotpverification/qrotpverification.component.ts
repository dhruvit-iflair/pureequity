import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
  constructor(private fb: FormBuilder, private http: Http, private router: Router, private toastr: ToastrService) { }
  qr = { img: '', key: '' }; isqrenable = false;uid;
  ngOnInit() {
    this.veryform = this.fb.group({
      totp: [null, Validators.compose([Validators.required])]
    });
    var tokendata = JSON.parse(localStorage.getItem('token'));
    this.uid=tokendata.user._id;
    // if (tokendata) {
    //   this.qr.img = tokendata.data.twofactor.dataURL;
    //   this.qr.key = tokendata.data.twofactor.tempSecret;
    //   this.isqrenable = true;
    // }
    if (!tokendata.user.is2FAEnabled) {
      var obj = { username: tokendata.user.username };
      this.http.post(environment.api + '/security/setup', obj)
        .subscribe((resp: any) => {
          var x = resp.json();
          this.qr.img = x.data.twofactor.dataURL;
          this.qr.key = x.data.twofactor.tempSecret;
          this.isqrenable = true;
        }, (err) => {
          var x = err.json();
          console.log(x);
        });
    }
    else {
      this.qr.key = tokendata.data.twofactor.tempSecret;
      this.isqrenable = false;
    }
  }
  verifyotp() {
    var uobj = {
      totp: this.veryform.value.totp,
      key: this.qr.key
    };
    this.http.post(environment.api + '/security/totp', uobj)
      .subscribe((resp: any) => {
        var x = resp.json();
        if (x.verificationstatus == 'success') {
          this.userprocess(true);
        }
      }, (err) => {
        var x = err.json();
        if (x.verificationstatus != 'success') {
          this.toastr.error('The 2FA Code you entered was not correct. Please try again with a new Secret Code.', 'Error');
        }
      });
  }
  disable2FA(){
    var uobj = {
      totp: this.veryform.value.totp,
      key: this.qr.key
    };
    this.http.post(environment.api + '/security/totp', uobj)
      .subscribe((resp: any) => {
        var x = resp.json();
        if (x.verificationstatus == 'success') {
          this.userprocess(false);
        }
      }, (err) => {
        var x = err.json();
        if (x.verificationstatus != 'success') {
          this.toastr.error('The 2FA Code you entered was not correct. Please try again with a new Secret Code.', 'Error');
        }
      });
  }
  userprocess(aEnabled){
    var uobj;
    if(aEnabled==false){
      uobj={token:{twofactor:{}},is2FAEnabled:aEnabled};
    }
    else{
      uobj={is2FAEnabled:aEnabled};
    }
    this.http.patch(environment.api + '/users/'+this.uid, uobj)
    .subscribe((resp: any) => {
      var x = resp.json();
      if (x.nModified == 1 && aEnabled==false) {
        this.toastr.success('Two Factor Authentification Disabled From Now Onwards.', 'Success');
        this.isqrenable = true;
        this.router.navigate(['/login']);
      }
      if (x.nModified == 1 && aEnabled==true) {
        this.toastr.success('Two Factor Authentification Enabled From Now Onwards.', 'Success');
        this.isqrenable = false;
        this.router.navigate(['/login']);
      }
    }, (err) => {
      var x = err.json();
      if (x.nModified != 1) {
        this.toastr.error('The 2FA Code you entered was not correct. Please try again with a new Secret Code.', 'Error');
      }
    });
  }
}
