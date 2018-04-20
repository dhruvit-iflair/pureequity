import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, public loginService: LoginService, private toastr: ToastrService) { }

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
          this.toastr.success('Welcome!!', 'Success');
          // if(responsedata.data){
          //   this.router.navigate ( [ '/verification' ] );
          // }
          // else{
            this.router.navigate ( [ '/dashboard' ] );
          //}
      }
      else{
        this.toastr.warning('Email not verified ! Please Verify your Email', 'Warning');  
      }
    }, (error) => {
      this.toastr.error('Username/Password is incorrect', 'Error');
      console.log(error);
    });
  }

}
