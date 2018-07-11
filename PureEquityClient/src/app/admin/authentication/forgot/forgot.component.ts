import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, public loginService:LoginService, public toster:ToastrService) {}

  ngOnInit() {
    this.form = this.fb.group ( {
      email: [ null, Validators.compose( [ Validators.required, CustomValidators.email ] ) ]
    } );
  }

  onSubmit() {
      this.loginService.forget(this.form.value.email).subscribe((res)=>{
          this.toster.success(res['message'],"Success!");
      }, (err)=>{
          console.log(err);
          this.toster.error(err.error['message'],'Error!!');
      })
  }

}
