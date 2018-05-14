import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';

declare var require: any;

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit {
  userDocPoint = environment.userDocPoint;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isLinear = true;istrn=[];
  uploadedimgs = [];
  user; isEligible = false;
  isApproved = true; uid;
  countries = require('./countries.json');
  idType = ['Passport', 'Driving License', 'Identity Card'];
  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private http: Http, private toastr: ToastrService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('token'));
    this.firstFormGroup = this._formBuilder.group({
      country: ['', Validators.required],
      idtype: ['', Validators.required],
      cardnumber: ['', Validators.required],
      issuedate: ['', Validators.required],
      taxnumber: [''],
      istrn: []
    });
    this.secondFormGroup = this._formBuilder.group({
      scandoc: [null, Validators.required]
    });
    this.getInitialData();
  }
  getInitialData() {
    var usrdata = JSON.parse(localStorage.getItem('token'));
    this.http.get(environment.api + '/userdocs/byuid/' + usrdata.user._id)
      .subscribe((res) => {
        var gotcha = res.json();
        this.uid = gotcha[0]._id;
        //if (gotcha[0].isApproved == false) {
          this.isApproved = gotcha[0].isApproved;
        //}
        this.isEligible = true;
        this.firstFormGroup.patchValue({
          country: gotcha[0].issueCountry,
          idtype: gotcha[0].idType,
          cardnumber: gotcha[0].idNumber,
          issuedate: gotcha[0].issueDate,
          taxnumber: gotcha[0].trn
        });
        this.uploadedimgs = gotcha[0].scandoc;
        this.secondFormGroup.patchValue({ scandoc: this.uploadedimgs });
      }, (ers) => {
        console.log('Error while fetching data:' + ers);
      });
  }
  uploadDoc(event) {
    let file = event.target.files;
    for (var i = 0; i < file.length; i++) {
      let up = new FormData();
      up.append('image', file[i]);
      this.http.post(environment.api + "/userdocs/image", up)
        .subscribe((res) => {
          var data = res.json();
          this.uploadedimgs.push(data.image);
          this.secondFormGroup.patchValue({ scandoc: this.uploadedimgs });
          this.isEligible = true;
        });
    }
  }
  removeDoc(imgnm){
    let up={img:imgnm,user:this.user.user._id};
    this.http.post(environment.api + "/userdocs/rmimage", up)
    .subscribe((res) => {
      var data = res.json();
      if(data=="File Removed Successfully."){
        this.toastr.warning(data);
        this.getInitialData();
      }
      else{
        this.toastr.error(data);
      }
    });
  }

  finalsubmittion() {
    var obj = {
      user: this.user.user._id,
      idType: this.firstFormGroup.value.idtype,
      idNumber: this.firstFormGroup.value.cardnumber,
      scandoc: this.uploadedimgs,
      issueCountry: this.firstFormGroup.value.country,
      issueDate: this.firstFormGroup.value.issuedate,
      trn: this.firstFormGroup.value.taxnumber,
    };

    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { title: 'Want to Save ?', content: '' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.uid) {
          this.http.post(environment.api + '/userdocs/', obj)
            .subscribe((resp: any) => {
              var x = resp.json();
              this.toastr.success('KYC Filled Successfully', 'Success');
              this.router.navigate(['/dashboard']);
            }, (er) => {
              this.toastr.error('Internal Server Error.', 'Error');
            });
        }
        else {
          this.http.put(environment.api + '/userdocs/' + this.uid, obj)
            .subscribe((resp: any) => {
              var x = resp.json();
              this.toastr.success('KYC Updated Successfully', 'Success');
              this.router.navigate(['/dashboard']);
            }, (er) => {
              this.toastr.error('Internal Server Error.', 'Error');
            });
        }
      }
    });
  }

}
