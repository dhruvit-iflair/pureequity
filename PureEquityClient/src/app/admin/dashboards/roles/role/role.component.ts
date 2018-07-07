import { Component, OnInit } from '@angular/core';
import { Router,Params,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl,ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(private fb: FormBuilder,private snakebar:MatSnackBar, private http: Http, private router: Router,private aroute:ActivatedRoute , private toastr: ToastrService) { }
  public rolerFormGroup: FormGroup;
  public param;
  
  ngOnInit() {
    this.aroute.params.subscribe((params)=>{
      this.param=params.id;
      if(this.param){
        this.http.get(environment.api+'/role/'+this.param)
        .subscribe((res)=>{
          var x=res.json();
          this.rolerFormGroup.patchValue(x);
        });
      }
    });
    this.rolerFormGroup = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      status: ['Active']
    });
  }

  store(){
    if(this.param){
      this.http.put(environment.api+'/role/'+this.param,this.rolerFormGroup.value)
      .subscribe((res)=>{
        this.snakebar.open('Role Saved Successfully!','',{duration: 5000});        
        // this.toastr.success('Role Saved Successfully!','Success');
        this.router.navigate(['/admin/roles']);
      },(er)=>{
        this.snakebar.open('Internal Server Error!','',{duration: 5000});        
        // this.toastr.error('Internal Server Error!','Something went wrong!');
      });
    }
    else{
      this.http.post(environment.api+'/role',this.rolerFormGroup.value)
      .subscribe((res)=>{
        this.snakebar.open('Role Saved Successfully!','',{duration: 5000});
        // this.toastr.success('Role Saved Successfully!','Success');
        this.router.navigate(['/admin/roles']);
      },(er)=>{
        this.snakebar.open('Internal Server Error!','',{duration: 5000});        
        // this.toastr.error('Internal Server Error!','Something went wrong!');
      });
    }
  }

}
