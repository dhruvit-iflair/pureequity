import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../shared/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

 
  public form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, public loginService: LoginService, private toastr: ToastrService, private globalService:GlobalService) { }

  ngOnInit() {
    //this.qr={img:'',key:''};
    this.form = this.fb.group({
      email: [null, Validators.compose([Validators.required, CustomValidators.email])], 
      name: [null, Validators.compose([Validators.required])],
      message: [null, Validators.compose([Validators.required])]
    });
  }
  onSubmit() {
    var data = {
        title : 'Contact',
        search : ['[(contact.name)]', '[(contact.email)]', '[(contact.message)]'],
        replace : [ this.form.value.name, this.form.value.email, this.form.value.message,],
        from : 'no_replay@pureequity.com',
        to :'contact_us_pureequity@mailinator.com', 
        respmessage : 'Thank you for contacting us we will be in touch with you soon!!'
    }; 
    this.loginService.contact(data).subscribe((response: any) => {
      if (response) {
        console.log(response)
        this.toastr.success(response.message, 'Success');  
      }
      else{
        this.toastr.warning('Email not verified ! Please Verify your Email', 'Warning');  
      }
    }, (error) => {
      this.toastr.error((error.error['message']) ? error.error.message : error.error, 'Error');
      console.log(error);
    });
  }

}
