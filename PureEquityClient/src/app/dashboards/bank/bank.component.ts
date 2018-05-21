import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
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
  expyear = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  expmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  bankdetails: FormGroup;
  mainform: any;
  disableform: any;
  isagreed = false;
  public isbankdetails = false;
  public isccinfo = false;
  public isppdetails = false; resp;
  public data: any; hasdetails = false;
  token;
  hasccdetails = false;
  hasppdetails = false;
  constructor(  private _formBuilder: FormBuilder,
                public dialog: MatDialog,
                private router: Router,
                private http: Http,
                private toastr: ToastrService,
                private bankService: BankdetailsService) {
      this.token = JSON.parse(localStorage.getItem('token'));
  }

  ngOnInit() {
    // we will initialize our form here
    this.mainform = this._formBuilder.group({
      bankdetails: this._formBuilder.array([
        this.initForm('bankdetails'),
      ]),
      ccinfo: this._formBuilder.array([
      ]),
      ppdetails: this._formBuilder.array([
      ])
    });
    this.disableform = this._formBuilder.group({
      bankdetails: this._formBuilder.array([
        this.initDisableForm('bankdetails'),
      ]),
      ccinfo: this._formBuilder.array([
      ]),
      ppdetails: this._formBuilder.array([
      ])
    });
    this.hasdetails = false;
    this.addStartUpForm('bankdetails');
    this.addStartUpForm('ccinfo');
    this.addStartUpForm('ppdetails');
    this.http.get(environment.api + '/bankdetails/user/' + this.token.user._id).subscribe((res) => {
      this.resp = res.json();
      this.data = res.json();
      console.log(res.json());
      if (this.data && this.data.bankdetails && this.data.bankdetails.length) {
        this.valuepatcher(this.data.bankdetails, 'bankdetails');
        this.hasdetails = true;
      } else {
        this.addStartUpForm('bankdetails');
        this.hasdetails = false;
      }
      if (this.data && this.data.ccinfo && this.data.ccinfo.length) {
        this.valuepatcher(this.data.ccinfo, 'ccinfo');
        this.hasccdetails = true;
      } else {
        this.addStartUpForm('ccinfo');
        this.hasccdetails = false;
      }
      if (this.data && this.data.ppdetails && this.data.ppdetails.length) {
        this.valuepatcher(this.data.ppdetails, 'ppdetails');
        this.hasppdetails = true;
      } else {
        this.addStartUpForm('ppdetails');
        this.hasppdetails = false;
      }
    }, (err) => {
      console.log(err);
    });
  }
  valuepatcher(data, key) {
    // tslint:disable-next-line:prefer-const
    let controlArray = <FormArray>this.mainform.controls[key];
    controlArray.controls = [];
    // tslint:disable-next-line:prefer-const
    let controlArray2 = <FormArray>this.disableform.controls[key];
    controlArray2.controls = [];
    for (let index = 0; index < data.length; index++) {
      const fb = this.initForm(key);
      fb.patchValue(data[index]);
      controlArray.push(fb);
      const fb2 = this.initDisableForm(key);
      fb2.patchValue(data[index]);
      controlArray2.push(fb2);
    }
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
  initDisableForm(key) {
    const currentForm = {
      bankdetails: this._formBuilder.group({
        acnumber: [{value: '', disabled: true}, Validators.required],
        ifscnumber: [{value: '', disabled: true}, Validators.required],
        actype: [{value: '', disabled: true}, Validators.required],
        name: [{value: '', disabled: true}, Validators.required],
        bankdoctype: [{value: '', disabled: true}, Validators.required],
        isagreed: []
      }),
      ccinfo: this._formBuilder.group({
        ccname: [{value: '', disabled: true}, Validators.required],
        ccnumber: [{value: '', disabled: true}, Validators.required],
        expmonth: [{value: '', disabled: true}, Validators.required],
        expyear: [{value: '', disabled: true}, Validators.required],
        cvvnumber: [{value: '', disabled: true}, Validators.required]
      }),
      ppdetails: this._formBuilder.group({
        email: [{value: '', disabled: true}, Validators.compose([Validators.required, Validators.email])],
        pwd: [{value: '', disabled: true}, Validators.required]
      }),
    };
    return currentForm[key];
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
    const control2 = <FormArray>this.disableform.controls[key];
    control2.controls = [];
    control2.push(this.initDisableForm(key));
  }

  save( key, message) {
    // tslint:disable-next-line:prefer-const
    let obj: { [k: string]: any } = {};
    obj.user = this.token.user._id;
    obj[key] = this.mainform.value[key];
    obj.updated_at = Date.now();
    if (this.resp && this.resp._id) {
      this.http.put(environment.api + '/bankdetails/' + this.resp._id, obj).subscribe((res) => {
        console.log(res);
        this.toastr.success(message, 'Success');
        this.router.navigate(['/security']).then(() => {
          this.router.navigate(['/bank']);
        });
      }, (err) => {
        console.log(err);
      });
    } else {
      this.http.post(environment.api + '/bankdetails', obj).subscribe((res) => {
        console.log(res);
        this.toastr.success(message, 'Success');
        this.router.navigate(['/security']).then(() => {
          this.router.navigate(['/bank']);
        });
      }, (err) => {
        console.log(err);
      });
    }
  }
  removeForm(i, key, message) {
    const control = <FormArray>this.mainform.controls[key];
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { title: 'Confirm to Delete ?', content: '' , class: 'warn'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        control.removeAt(i);
        this.save(key, message);
      }
    });
  }
  // addAddress() {
  //   const control = <FormArray>this.mainform.controls['bankdetails'];
  //   control.push(this.initAddress());
  // }

  // removeAddress(i: number) {
  //   const control = <FormArray>this.mainform.controls['bankdetails'];
  //   control.removeAt(i);
  // }
}
