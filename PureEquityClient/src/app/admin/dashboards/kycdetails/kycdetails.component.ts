import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, animateChild, keyframes } from "@angular/animations";

import { Http } from "@angular/http";
import { DateAdapter, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';

declare var require: any;
@Component({
  selector: 'app-kycdetails',
  templateUrl: './kycdetails.component.html',
  styleUrls: ['./kycdetails.component.css']
})
export class KycdetailsComponent implements OnInit {
  public userDocPoint = environment.userDocPoint;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public isLinear = true;
  public uploadedimgs :Array<any> = []; 
  public istrn = [];
  public user; isEligible = false;
  public isApproved = true; uid;
  public countries = require('./countries.json');
  public deletedscandoc = [];
  public params_id: String;
  public idType = ['Passport', 'Driving License', 'Identity Card'];
  constructor(public dialogRef: MatDialogRef<KycdetailsComponent>, private _formBuilder: FormBuilder, private snakebar: MatSnackBar, public dialog: MatDialog, private acRoute: ActivatedRoute, private router: Router, private http: Http, private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.uploadedimgs = [];
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
      this.http.get(environment.api + '/userdocs/byuid/' + this.data.user._id)
        .subscribe((res) => {
          var gotcha = res.json();
          this.user=gotcha[0].user;
          this.uid = gotcha[0]._id;
          this.isApproved = gotcha[0].isApproved;
          this.isEligible = true;
          this.firstFormGroup.patchValue({
            country: gotcha[0].issueCountry,
            idtype: gotcha[0].idType,
            cardnumber: gotcha[0].idNumber,
            issuedate: gotcha[0].issueDate,
            taxnumber: gotcha[0].trn
          });
          this.uploadedimgs = gotcha[0].scandoc;
          this.deletedscandoc =  gotcha[0].deletedscandoc;
          this.secondFormGroup.patchValue({ scandoc: this.uploadedimgs });
        }, (ers) => {
          console.log('Error while fetching data:' + ers);
        });
  }
  removeDoc(i) {
    this.uploadedimgs.splice(i, 1);
    this.secondFormGroup.patchValue({ scandoc: this.uploadedimgs });
  }
  removeDeletedDoc(i) {
    this.deletedscandoc.splice(i, 1);
    this.secondFormGroup.patchValue({ deletedscandoc: this.deletedscandoc });
  }
  finalsubmittion() {
    var obj = {
      user: this.user._id,
      idType: this.firstFormGroup.value.idtype,
      idNumber: this.firstFormGroup.value.cardnumber,
      scandoc: this.uploadedimgs,
      issueCountry: this.firstFormGroup.value.country,
      issueDate: this.firstFormGroup.value.issuedate,
      trn: this.firstFormGroup.value.taxnumber,
      deletedscandoc: this.deletedscandoc
    };

    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { title: 'Want to Save ?', content: '', class: 'primary' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put(environment.api + '/userdocs/' + this.uid, obj)
          .subscribe((resp: any) => {
            var x = resp.json();
            this.snakebar.open('KYC Updated Successfully', '', { duration: 5000 });
            this.dialogRef.close();
            // this.router.navigate(['/admin/kyc']);
          }, (er) => {
            this.snakebar.open('Internal Server Error.', '', { duration: 5000 });
            // this.toastr.error('Internal Server Error.', 'Error');
          });
      }
    });
  }
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files) {
      this.uploadDoc({target: { files: event.dataTransfer.files}});
    }
  }
  
  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  uploadDoc(event) {
    let file = event.target.files;
    var that = this;
    (this.uploadedimgs) ? null : this.uploadedimgs =[];  
    for (var i = 0; i < file.length; i++) {
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        that.uploadedimgs.push(FR.result);
        that.secondFormGroup.patchValue({scandoc: that.uploadedimgs});
      });
      FR.readAsDataURL( file[i] );
    }
  }
}
