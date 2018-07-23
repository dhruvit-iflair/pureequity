import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { DateAdapter, MatDialog, MatSnackBar } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { card, flip } from '../../shared/animations/animations';
import { BankdetailsService } from '../../shared/services/bankdetails.service';
import { Bank } from '../../shared/interfaces/user.interface';

const credCardRegx = /^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}| 222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
  animations: [card, flip]
})
export class BankComponent implements OnInit {

  bankdoctype = ['Passport', 'Driving License', 'Identity Card']; actype = ['Current', 'Saving'];
  expyear = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  expmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  bankdetails: FormGroup;
  mainform: any;
  isagreed = false;
  public isbankdetails = false;
  isBankDescription;isCCDescription;isPPDescription;
  // public isccinfo = false;
  // public isppdetails = false;
  resp;
  public data: {
    bankdetails: Array<any>,
    ccinfo: Array<any>,
    ppdetails: Array<any>
  } = {
    bankdetails: [],
    ccinfo: [],
    ppdetails: []
  };
  hasdetails = false;
  token;
  hasccdetails = false;
  hasppdetails = false;
  constructor(  private _formBuilder: FormBuilder,
                public dialog: MatDialog,
                private router: Router,
                private http: Http,
                private snakebar:MatSnackBar,
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
    this.hasdetails = false;
    this.addStartUpForm('bankdetails');
    this.addStartUpForm('ccinfo');
    this.addStartUpForm('ppdetails');
    this.http.get(environment.api + '/bankdetails/user/' + this.token.user._id).subscribe((res) => {
      this.resp = res.json();
      this.data = res.json();
      if (this.data && this.data.bankdetails && this.data.bankdetails.length) {
        this.valuepatcher(this.data.bankdetails, 'bankdetails');
        this.hasdetails = true;
      } else {
        this.addStartUpForm('bankdetails');
        this.hasdetails = false;
      }
      if (this.data && this.data.ccinfo && this.data.ccinfo.length) {
        console.log(this.data);
        this.valuepatcher(this.data.ccinfo, 'ccinfo');
        this.hasccdetails = true;
        (this.data.ccinfo.length > -1)? this.data.ccinfo.forEach((cc)=>{
          cc['ccnumber'] ='XXXXXXXXXXXX' + cc['ccnumber'].substr(cc['ccnumber'].length-4);
          return cc['cvvnumber'] = ''
        }):null;
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
    for (let index = 0; index < data.length; index++) {
      const fb = this.initForm(key);
      fb.patchValue(data[index]);
      controlArray.push(fb);
    }
  }
  initForm(key) {
    const currentForm = {
      bankdetails: this._formBuilder.group({
        acnumber: ['', Validators.compose([Validators.required,Validators.pattern(".{12,20}"),Validators.maxLength(20), Validators.minLength(12)])],
        ifscnumber: ['', Validators.required],
        actype: ['', Validators.required],
        name: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*$"), Validators.maxLength(30)])],
        bankdoctype: ['', Validators.required],
        isagreed: []
      }),
      ccinfo: this._formBuilder.group({
        ccname: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*$"), Validators.maxLength(30)])],
        ccnumber: ['', Validators.compose([Validators.required,Validators.pattern(credCardRegx), Validators.maxLength(16), Validators.minLength(16)])],
        expmonth: ['', Validators.required],
        expyear: ['', Validators.required],
        cvvnumber: ['']
      }),
      ppdetails: this._formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        pwd: ['', Validators.required]
      }),
    };
    return currentForm[key];
  }
  addNewForm(key) {
    if (this.mainform.controls[key].valid) {
      const control = <FormArray>this.mainform.controls[key];
      control.push(this.initForm(key));
    } else {
      this.snakebar.open('Please fill up all the required fields','',{duration: 5000});
      // this.toastr.warning('Please fill up all the required fields', 'Warning');
    }
  }
  addStartUpForm(key) {
    const control = <FormArray>this.mainform.controls[key];
    control.controls = [];
    control.push(this.initForm(key));
  }

  save( key, message) {
    if (this.mainform.controls[key].valid) {
      // tslint:disable-next-line:prefer-const
        let obj: { [k: string]: any } = {};
        obj.user = this.token.user._id;
        obj[key] = this.mainform.value[key];
        obj.updated_at = Date.now();
        if (this.resp && this.resp._id) {
          this.http.put(environment.api + '/bankdetails/' + this.resp._id, obj).subscribe((res) => {
            // this.toastr.success(message, 'Success');
            this.snakebar.open(message,'',{duration: 5000});
            this.router.navigate(['/security']).then(() => {
              this.router.navigate(['/bank']);
            });
          }, (err) => {
            console.log(err);
          });
        } else {
          this.http.post(environment.api + '/bankdetails', obj).subscribe((res) => {
            console.log(res);
            // this.toastr.success(message, 'Success');
            this.snakebar.open(message,'',{duration: 5000});
            this.router.navigate(['/security']).then(() => {
              this.router.navigate(['/bank']);
            });
          }, (err) => {
            console.log(err);
          });
        }
    } else {
      this.snakebar.open('Please fill up all the required fields','',{duration: 5000});
      // this.toastr.warning('Please fill up all the required fields', 'Warning');
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
  isNumber($event){
    if ($event.which < 48 || $event.which > 57) $event.preventDefault();
  }

  isChar($event){
    var charCode = ($event.charCode) ? $event.charCode : (($event.keyCode) ? $event.keyCode : (($event.which) ? $event.which : 0));
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode !=32) {
          $event.preventDefault()
    }

  }
}

