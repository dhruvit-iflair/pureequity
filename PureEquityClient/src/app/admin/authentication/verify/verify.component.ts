import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { LoginService } from '../../shared/services/login.service';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/interfaces/role.interface';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  public form: FormGroup;
  public token: String;
  constructor(private fb: FormBuilder, private router: Router, private active: ActivatedRoute, private loginService: LoginService, public toster: ToastrService,private snakebar:MatSnackBar) {
    this.active.queryParams.subscribe((params) => {
      if (params && params['token']) {
        this.loginService.verifyAccount(params).subscribe((res) => {
          localStorage.clear();
          // this.toster.success(res['message'], 'Success!!');
        this.snakebar.open(res['message'],'',{duration: 5000});                  
          this.router.navigate(['/login']);          
        }, (err) => {
          // this.toster.error(err.error['message'], 'Error!!');
        this.snakebar.open(err.error['message'],'',{duration: 5000});                  
          this.router.navigate(['/login']);
        })
      } else {
        this.snakebar.open('Something went wrong please try again later','',{duration: 5000});                          
        // this.toster.error("Something went wrong please try again later", 'Error!!');        
        this.router.navigate(['/login']);        
      }
    })
  }

  ngOnInit() {
  }
}
