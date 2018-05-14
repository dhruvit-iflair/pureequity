import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { card, flip } from '../../shared/animations/animations';
import { BankdetailsService } from '../../shared/services/bankdetails.service';
import { Bank } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-bankdetails',
  templateUrl: './bankdetails.component.html',
  styleUrls: ['./bankdetails.component.css'],
  animations: [card, flip]
})
export class BankdetailsComponent implements OnInit {
  bankdoctype = ['A', 'B', 'C', 'D']; actype = ['Current', 'Saving'];
  expyear = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']; expmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  bankdetails: FormGroup;
  savedbankdetails: FormGroup;
  ccinfo: FormGroup;
  sccdetails: FormGroup;
  ppdetails: FormGroup;
  sppdetails: FormGroup;
  isagreed = false;
  public isbankdetails = false;
  public isccinfo = false;
  public isppdetails = false;
  public data: Bank;
  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private http: Http, private toastr: ToastrService, private bankService: BankdetailsService) { }

  ngOnInit() {
    this.bankdetails = this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      actype: ['', Validators.required],
      name: ['', Validators.required],
      bankdoctype: ['', Validators.required],
      isagreed: []
    });
    this.ccinfo = this._formBuilder.group({
      ccname: ['', Validators.required],
      ccnumber: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      cvvnumber: ['', Validators.required]
    });
    this.ppdetails = this._formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      pwd: ['', Validators.required]
    });
    this.savedbankdetails = this._formBuilder.group({
      acnumber: [{value: '', disabled:true}, Validators.required],
      ifscnumber: [{value: '', disabled:true}, Validators.required],
      actype: [{value: '', disabled:true}, Validators.required],
      name: [{value: '', disabled:true}, Validators.required],
      bankdoctype: [{value: '', disabled:true}, Validators.required],
      isagreed: []
    });
    this.sccdetails = this._formBuilder.group({
      ccname: [{value: '', disabled:true}, Validators.required],
      ccnumber: [{value: '', disabled:true}, Validators.required],
      expmonth: [{value: '', disabled:true}, Validators.required],
      expyear: [{value: '', disabled:true}, Validators.required],
      cvvnumber: [{value: '', disabled:true}, Validators.required]
    });
    this.sppdetails = this._formBuilder.group({
      email: [{value: '', disabled:true}, Validators.compose([Validators.required, Validators.email])],
      pwd: [{value: '', disabled:true}, Validators.required]
    });
    var tokendata = JSON.parse(localStorage.getItem('token'));
 
    this.bankService.getBankdetailByUserId().subscribe((data) => {
      if (data.bankdetails) { 
        this.bankdetails.patchValue(data.bankdetails); 
        this.savedbankdetails.patchValue(data.bankdetails); 
        this.isbankdetails = true;
      }
      if (data.ccinfo) { 
        this.ccinfo.patchValue(data.ccinfo);
        this.sccdetails.patchValue(data.ccinfo);
        this.isccinfo = true;
      }
      if (data.ppdetails) { 
        this.ppdetails.patchValue(data.ppdetails);
        this.sppdetails.patchValue(data.ppdetails);
        this.isppdetails = true;
      }
      this.data = data;
    })
    // this.bankdetails.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.data.bankdetails = val;
    //   }
    // })
    // this.savedbankdetails.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.data.savedbankdetails = val;
    //   }
    // })
    // this.ccinfo.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.data.ccinfo = val;
    //   }
    // })
    // this.sccdetails.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.data.sccdetails = val;
    //   }
    // })
    // this.ppdetails.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.data.ppdetails = val;
    //   }
    // })
    // this.sppdetails.valueChanges.subscribe((val) => {
    //   if (val) {
    //     this.data.sppdetails = val;
    //   }
    // })
    this.bankService.getByUserId(tokendata.user._id);
  }

  uploaddocs() {
    this.toastr.warning('Test Success!');
  }
  checkifsc() {
    this.toastr.success('Test Success!');
  }
  saveBank(){
    var tokendata = JSON.parse(localStorage.getItem('token'));
    var data : {[k: string]: any} = {};
    data.user = tokendata.user._id;
    data.bankdetails = this.bankdetails.value;
    data.updated_at = Date.now();
    if (this.data._id) {
      this.bankService.put(this.data._id,data).subscribe((res)=>{
        console.log(res);
        this.bankService.getByUserId(data.user);
      })
    }
    else {
      this.bankService.post(data).subscribe((res)=>{
        console.log(res);
        this.bankService.getByUserId(data.user);
      })
    }
  }
  saveCCDetails(){
    var tokendata = JSON.parse(localStorage.getItem('token'));
    var data : {[k: string]: any} = {};
    data.user = tokendata.user._id;
    data.ccinfo = this.ccinfo.value;
    data.updated_at = Date.now();
    
    if (this.data._id) {
      this.bankService.put(this.data._id,data).subscribe((res)=>{
        console.log(res);
        this.bankService.getByUserId(data.user);
      })
    }
    else {
      this.bankService.post(data).subscribe((res)=>{
        console.log(res);
        this.bankService.getByUserId(data.user);
      })
    }
  }
  savePPDetails(){
    var tokendata = JSON.parse(localStorage.getItem('token'));
    console.log(this.data);
    var data : {[k: string]: any} = {};
    data.user = tokendata.user._id;
    data.ppdetails = this.ppdetails.value;
    data.updated_at = Date.now();
    
    if (this.data && this.data._id) {
      this.bankService.put(this.data._id,data).subscribe((res)=>{
        console.log(res);
        this.bankService.getByUserId(data.user);
      })
    }
    else {
      this.bankService.post(data).subscribe((res)=>{
        console.log(res);
        this.bankService.getByUserId(data.user);
      })
    }
  }
}
