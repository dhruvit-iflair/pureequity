import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';

@Component({
  selector: 'app-bankdetails',
  templateUrl: './bankdetails.component.html',
  styleUrls: ['./bankdetails.component.css']
})
export class BankdetailsComponent implements OnInit {
  bankdoctype=['A','B','C','D'];actype=['Current','Saving'];
  expyear=['2018','2019','2020','2021','2022','2023','2024','2025'];expmonth=['1','2','3','4','5','6','7','8','9','10','11','12'];
  bankdetails: FormGroup;
  savedbankdetails: FormGroup;
  ccinfo: FormGroup;
  sccdetails: FormGroup;
  ppdetails: FormGroup;
  sppdetails: FormGroup;
  isagreed=false;
  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private http: Http, private toastr: ToastrService) { }
  
  ngOnInit() {
    this.bankdetails = this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      actype: ['', Validators.required],
      name: ['', Validators.required],
      bankdoctype: ['', Validators.required],
      isagreed: []
    });
    this.savedbankdetails=this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      bankname: ['', Validators.required],
      amount:['', Validators.required]
    });
    this.ccinfo=this._formBuilder.group({
      ccname: ['', Validators.required],
      ccnumber: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      cvvnumber: ['', Validators.required]
    });
    this.sccdetails=this._formBuilder.group({
      ccnumber: ['', Validators.required],
      cvvnumber: ['', Validators.required],
      amount:['', Validators.required]
    });
    this.ppdetails=this._formBuilder.group({
      email: ['', Validators.required,Validators.email],
      pwd: ['', Validators.required]
    });
    this.sppdetails=this._formBuilder.group({
      semail: ['', Validators.required,Validators.email],
      amount:['', Validators.required]
    });
    var tokendata=JSON.parse(localStorage.getItem('token'));
    if(tokendata.user.role.name!='admin'){
      document.getElementById('customeCss').setAttribute('style', 'top: -7%;');
    }
    else{
      document.getElementById('customeCss').setAttribute('style', 'top: -9%;');
    }
    //this.getInitialData();
  }

  uploaddocs(){
    this.toastr.warning('Test Success!');
  }
  checkifsc(){
    this.toastr.success('Test Success!');
  }
}
