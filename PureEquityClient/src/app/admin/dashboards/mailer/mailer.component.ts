import { Component, OnInit } from '@angular/core';
import { Router,Params,ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mailer',
  templateUrl: './mailer.component.html',
  styleUrls: ['./mailer.component.css']
})
export class MailerComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: Http,private snakebar:MatSnackBar, private router: Router,private aroute:ActivatedRoute , private toastr: ToastrService) { }
  public mailFormGroup: FormGroup;
  public param;isReadonly=false;
  
  ngOnInit() {
    this.aroute.params.subscribe((params)=>{
      this.param=params.id;
      if(this.param){
        this.http.get(environment.api+'/mails/'+this.param)
        .subscribe((res)=>{
          this.isReadonly=true;
          var x=res.json();
          this.mailFormGroup.patchValue(x);
        });
      }
    });
    this.mailFormGroup = this.fb.group({
      title: [null, Validators.compose([Validators.required])],
      subject: [null, Validators.compose([Validators.required])],
      content: [null, Validators.compose([Validators.required])]
    });
  }

  store(){
    if(this.param){
      this.http.put(environment.api+'/mails/'+this.param,this.mailFormGroup.value)
      .subscribe((res)=>{
        this.snakebar.open('Mail Template Saved Successfully!','',{duration: 5000});        
        // this.toastr.success('Mail Template Saved Successfully!','Success');
        this.router.navigate(['/admin/mails']);
      },(er)=>{
        this.snakebar.open('Internal Server Error.','',{duration: 5000});
        // this.toastr.error('Internal Server Error!','Something went wrong!');
      });
    }
    else{
      this.http.post(environment.api+'/mails',this.mailFormGroup.value)
      .subscribe((res)=>{
        this.snakebar.open('Mail Template Saved Successfully!','',{duration: 5000});
        // this.toastr.success('Mail Template Saved Successfully!','Success');
        this.router.navigate(['/admin/mails']);
      },(er)=>{
        this.snakebar.open('Internal Server Error.','',{duration: 5000});
        // this.toastr.error('Internal Server Error!','Something went wrong!');
      });
    }
  }

}
