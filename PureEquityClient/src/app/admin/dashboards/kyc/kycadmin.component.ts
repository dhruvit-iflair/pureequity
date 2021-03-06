import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, animateChild, keyframes } from "@angular/animations";

import { Http } from "@angular/http";
import { DateAdapter, MatDialog, MatSnackBar } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { ImageModalComponent } from '../../shared/dialogs/image-modal/image-modal.component';

declare var require: any;

@Component({
  selector: 'app-kycadm',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
  animations: [
    trigger('card', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
        animate('0.7s cubic-bezier(.8, -0.6, 0.26, 1.6)',
          style({ transform: 'scale(1)', opacity: 1 }))  // final
      ])
    ])
  ]
})
export class KycAdminComponent implements OnInit {
  userDocPoint = environment.userDocPoint;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  dispalayFormGroup: FormGroup;
  isLinear = true;
  uploadedimgs = [];istrn=[];
  user; isEligible = false;
  isApproved = true; uid;
  countries = require('./countries.json');
  isEdit = false;
  isAdmin = true;
  deletedscandoc = [];
  params_id:String;
  idType = ['Passport', 'Driving License', 'Identity Card'];
  constructor(private _formBuilder: FormBuilder,private snakebar:MatSnackBar, public dialog: MatDialog, private acRoute: ActivatedRoute, private router: Router, private http: Http, private toastr: ToastrService) { }

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
    this.dispalayFormGroup = this._formBuilder.group({
      country: [{ value: '', disabled: true }, Validators.required],
      idtype: [{ value: '', disabled: true }, Validators.required],
      cardnumber: [{ value: '', disabled: true }, Validators.required],
      issuedate: [{ value: '', disabled: true }, Validators.required],
      taxnumber: [{ value: '', disabled: true }, Validators.required],
      istrn: []
    });
    this.secondFormGroup = this._formBuilder.group({
      scandoc: [null, Validators.required]
    });
    this.getInitialData();
  }
  getInitialData() {
    this.acRoute.params.subscribe((params) => {
      this.params_id = params.id;
      this.http.get(environment.api + '/userdocs/byuid/' + params.id)
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
          this.dispalayFormGroup.patchValue({
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
          this.isEdit = true;
          console.log('Error while fetching data:' + ers);
        });
    });
  }
  uploadDoc(event) {
    let file = event.target.files;
    var that = this;
    for (var i = 0; i < file.length; i++) {
      var FR= new FileReader();
      FR.addEventListener("load", function(e) {
        that.uploadedimgs.push(e.target['result']);
        that.secondFormGroup.patchValue({scandoc: that.uploadedimgs});
      });
      FR.readAsDataURL( file[i] );
    }
  }
  removeDoc(i){
    this.uploadedimgs.splice(i,1);
    this.secondFormGroup.patchValue({scandoc: this.uploadedimgs});
  }
  removeDeletedDoc(i){
    this.deletedscandoc.splice(i,1);
    this.secondFormGroup.patchValue({deletedscandoc: this.deletedscandoc});
  }
  finalsubmittion() {
    var obj = {
      user: this.user._id || this.params_id,
      idType: this.firstFormGroup.value.idtype,
      idNumber: this.firstFormGroup.value.cardnumber,
      scandoc: this.uploadedimgs,
      issueCountry: this.firstFormGroup.value.country,
      issueDate: this.firstFormGroup.value.issuedate,
      trn: this.firstFormGroup.value.taxnumber,
      deletedscandoc:this.deletedscandoc
    };

    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { title: 'Want to Save ?', content: '', class:'primary' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.uid) {
          this.http.post(environment.api + '/userdocs/', obj)
            .subscribe((resp: any) => {
              var x = resp.json();
              this.snakebar.open('KYC Filled Successfully','',{duration: 5000});
              // this.toastr.success('KYC Filled Successfully', 'Success');
              this.router.navigate(['/admin/kyc']);
            }, (er) => {
              this.snakebar.open('Internal Server Error.','',{duration: 5000});
              // this.toastr.error('Internal Server Error.', 'Error');
            });
        }
        else {
          this.http.put(environment.api + '/userdocs/' + this.uid, obj)
            .subscribe((resp: any) => {
              var x = resp.json();
              this.snakebar.open('KYC Updated Successfully','',{duration: 5000});
              // this.toastr.success('KYC Updated Successfully', 'Success');
              this.router.navigate(['/admin/kyc']);
            }, (er) => {
              this.snakebar.open('Internal Server Error.','',{duration: 5000});
              // this.toastr.error('Internal Server Error.', 'Error');
            });
        }
      }
    });
  }
  toggle_edit(){
    if(this.uid){
      this.isEdit = !this.isEdit
    }
    else {
      this.isEdit = false
    }
  }
  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.dataTransfer.files);
    if (event.dataTransfer && event.dataTransfer.files) {
       this.uploadDoc({target: { files: event.dataTransfer.files}});
    }
    // your code goes here after droping files or any
  }

  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  fancyImage(img){
    let dialogRef = this.dialog.open(ImageModalComponent, {
      // data: { title: 'Want to Save ?', content: '', class:'primary' },
      data:{
        image:img
      },
      height:'70%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }
}
