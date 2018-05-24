import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
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
  expyear = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  expmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  bankdetails: FormGroup;
  mainform: any;
  isagreed = false;
  isBankEdit = false;
  isCCEdit = false;
  isPPEdit = false;
  hasdetails = false;
  hasppdetails = false;
  hasccdetails = false;
  private tokendata = JSON.parse(localStorage.getItem('token'));
  public isbankdetails = false;
  public isccinfo = false;
  public isppdetails = false;
  public data: any;
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private http: Http,
    private toastr: ToastrService,
    private bankService: BankdetailsService) { }

  ngOnInit() {
    // we will initialize our form here
    this.mainform = this._formBuilder.group({
      bankdetails: this._formBuilder.array([
      ]),
      ccinfo: this._formBuilder.array([
      ]),
      ppdetails: this._formBuilder.array([
      ])
    });
    this.hasdetails = false;
    this.bankService.getByUserId(this.tokendata.user._id);
    this.bankService.getBankdetailByUserId().subscribe((data) => {
      console.log(data);
      this.data = data;
      if (data && data.bankdetails && data.bankdetails.length) {
        this.isbankdetails = true;
        this.addMultipleForms(data.bankdetails, 'bankdetails');
        this.hasdetails = true;
      } else {
        this.addStartUpForm('bankdetails');
        this.hasdetails = false;
      }
      if (data && data.ccinfo && data.ccinfo.length) {
        this.isccinfo = true;
        this.addMultipleForms(data.ccinfo, 'ccinfo');
        this.hasccdetails = true;
      } else {
        this.addStartUpForm('ccinfo');
        this.hasccdetails = false;
      }
      if (data && data.ppdetails && data.ppdetails.length) {
        this.isppdetails = true;
        this.addMultipleForms(data.ppdetails, 'ppdetails');
        this.hasppdetails = true;
      } else {
        this.addStartUpForm('ppdetails');
        this.hasppdetails = false;
      }
    });
  }
  initForm(key) {
    const currentForm = {
      bankdetails: this._formBuilder.group({
        acnumber: ['', Validators.required],
        ifscnumber: ['', Validators.required],
        actype: ['', Validators.required],
        name: ['', Validators.required],
        bankdoctype: ['', Validators.required],
        isagreed: []
      }),
      ccinfo: this._formBuilder.group({
        ccname: ['', Validators.required],
        ccnumber: ['', Validators.required],
        expmonth: ['', Validators.required],
        expyear: ['', Validators.required],
        cvvnumber: ['', Validators.required]
      }),
      ppdetails: this._formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        pwd: ['', Validators.required]
      }),
    };
    return currentForm[key];
  }
  removeForm(i, key, message) {
    const control = <FormArray>this.mainform.controls[key];
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { title: 'Confirm to Delete ?', content: '' , class: 'warn'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        control.removeAt(i);
        this.save(i, key, message);
      }
    });
  }

  addNewForm(key) {
    if (this.mainform.controls[key].valid) {
      const control = <FormArray>this.mainform.controls[key];
      control.push(this.initForm(key));
    } else {
      this.toastr.warning('Please fill up all the required fields', 'Warning');
    }
  }
  addStartUpForm(key) {
    const control = <FormArray>this.mainform.controls[key];
    control.controls = [];
    control.push(this.initForm(key));
  }

  save(i, key, message) {
    // tslint:disable-next-line:prefer-const
    let daa: { [k: string]: any } = {};
    daa.user = this.tokendata.user._id;
    daa[key] = this.mainform.value[key];
    daa.updated_at = Date.now();
    if (this.data && this.data._id) {
      this.bankService.put(this.data._id, daa).subscribe((res) => {
        console.log(res);
        this.toastr.success(message, 'Success');
        this.bankService.getByUserId(daa.user);
      });
    } else {
      this.bankService.post(daa).subscribe((res) => {
        console.log(res);
        this.toastr.success(message, 'Success');
        this.bankService.getByUserId(daa.user);
      });
    }
  }
  addMultipleForms(data, key) {
    // tslint:disable-next-line:prefer-const
    let controlArray = <FormArray>this.mainform.controls[key];
    controlArray.controls = [];
    for (let index = 0; index < data.length; index++) {
      const fb = this.initForm(key);
      fb.patchValue(data[index]);
      controlArray.push(fb);
    }
  }
}
