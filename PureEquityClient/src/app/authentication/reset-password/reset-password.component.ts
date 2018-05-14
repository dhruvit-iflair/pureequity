import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/interfaces/role.interface';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private fb: FormBuilder, private router: Router, private active: ActivatedRoute, private loginService: LoginService, public toster: ToastrService) {
    this.active.queryParams.subscribe((params) => {
      if (params && params['token']) {
        this.loginService.verifyToken(params.token).subscribe((res) => {
          this.token = params['token'];
        }, (err) => {
          this.toster.error(err.error['message'], 'Error!!');
          this.router.navigate(['/forgot']);
        })
      } else {
        this.router.navigate(['/forgot']);
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
      this.toster.success(response['message'], 'Success');
      this.router.navigate(['/login']);
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
    })
  }
}
