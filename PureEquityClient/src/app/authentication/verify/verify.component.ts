import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/interfaces/role.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  public form: FormGroup;
  public token: String;
  constructor(private fb: FormBuilder, private router: Router, private active: ActivatedRoute, private loginService: LoginService, public toster: ToastrService) {
    this.active.queryParams.subscribe((params) => {
      if (params && params['token']) {
        this.loginService.verifyAccount(params).subscribe((res) => {
          localStorage.clear();
          this.toster.success(res['message'], 'Success!!');
          this.router.navigate(['/login']);          
        }, (err) => {
          this.toster.error(err.error['message'], 'Error!!');
          this.router.navigate(['/login']);
        })
      } else {
        this.toster.error("Something went wrong please try again later", 'Error!!');        
        this.router.navigate(['/login']);        
      }
    })
  }

  ngOnInit() {
  }
}
