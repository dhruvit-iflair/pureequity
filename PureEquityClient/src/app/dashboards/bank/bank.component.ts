import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { card, flip } from '../../shared/animations/animations';
import { BankdetailsService } from '../../shared/services/bankdetails.service';
import { Bank } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
  animations: [card, flip]
})
export class BankComponent implements OnInit {

  bankdoctype = ['A', 'B', 'C', 'D']; actype = ['Current', 'Saving'];
  expyear = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']; expmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  bankdetails: FormGroup;
  mainform: FormGroup;
  isagreed = false;
  public isbankdetails = false;
  public isccinfo = false;
  public isppdetails = false; resp;
  public data: Bank; hasdetails = false; token;
  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private http: Http, private toastr: ToastrService, private bankService: BankdetailsService) {
    this.token = JSON.parse(localStorage.getItem("token"));
  }

  ngOnInit() {
    // we will initialize our form here
    this.mainform = this._formBuilder.group({
      bankdetails: this._formBuilder.array([
        this.initAddress(),
      ])
    });
    this.hasdetails = false;
    this.http.get(environment.api + '/bankdetails/user/' + this.token.user._id).subscribe((res) => {
      this.resp = res.json();
      //this.mainform.patchValue(this.resp);
      this.valuepatcher(this.resp.bankdetails, 'bankdetails');
      this.hasdetails = true;
    }, (err) => {
      console.log(err);
    });
  }
  valuepatcher(data, key) {
    let controlArray = <FormArray>this.mainform.controls[key];
    controlArray.controls = [];
    for (let index = 0; index < data.length; index++) {
      const fb = this.initAddress();
      fb.patchValue(data[index]);
      controlArray.push(fb);
    }
  }
  initdata() {
    this.bankdetails = this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      actype: ['', Validators.required],
      name: ['', Validators.required],
      bankdoctype: ['', Validators.required],
      isagreed: []
    });
  }
  initAddress() {
    // initialize our address
    return this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      actype: ['', Validators.required],
      name: ['', Validators.required],
      bankdoctype: ['', Validators.required],
      isagreed: []
    });
  }
  saveBank() {
    var obj = { bankdetails: this.mainform.controls.bankdetails.value, user: this.token.user._id };
    if (this.resp && this.resp._id) {
      this.http.put(environment.api + '/bankdetails/' + this.resp._id, obj).subscribe((res) => {
        console.log(res);
        this.toastr.success('Bank Details Updated Successfully!', 'Success');
        this.router.navigate(['/security']).then(()=>{
          this.router.navigate(['/bank']);
        });
      }, (err) => {
        console.log(err);
      });
    }
    else {
      this.http.post(environment.api + '/bankdetails', obj).subscribe((res) => {
        console.log(res);
        this.toastr.success('Bank Details Added Successfully!', 'Success');
        this.router.navigate(['/security']).then(()=>{
          this.router.navigate(['/bank']);
        });
      }, (err) => {
        console.log(err);
      });
    }
  }
  addAddress() {
    const control = <FormArray>this.mainform.controls['bankdetails'];
    control.push(this.initAddress());
  }

  removeAddress(i: number) {
    const control = <FormArray>this.mainform.controls['bankdetails'];
    control.removeAt(i);
  }
}
