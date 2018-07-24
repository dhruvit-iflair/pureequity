import { Component, OnInit, ViewChild, state } from '@angular/core';
import { Http } from "@angular/http";
import { DateAdapter, MatDialog, MatSnackBar } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { card } from '../../shared/animations/animations';
import { ImageModalComponent } from '../../shared/dialogs/image-modal/image-modal.component';

declare var require: any;

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
  animations: [
    card
  ]
})
export class KycComponent implements OnInit {
  userDocPoint = environment.userDocPoint;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  dispalayFormGroup: FormGroup;
  isLinear = true; istrn = [];
  uploadedimgs = [];
  user; isEligible = false;
  isApproved = true; uid;
  isEdit = false;
  isAdmin = false;
  countries = require('./countries.json');
  idType = ['Passport', 'Driving License', 'Identity Card'];
  public deletedscandoc: Array <any>= [];
  constructor(private _formBuilder: FormBuilder,private snakebar:MatSnackBar, public dialog: MatDialog, private router: Router, private http: Http, private toastr: ToastrService) { }

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
    var usrdata = JSON.parse(localStorage.getItem('token'));
    this.http.get(environment.api + '/userdocs/byuid/' + usrdata.user._id)
      .subscribe((res) => {
        var gotcha = res.json();
        this.uid = gotcha[0]._id;
        // (!this.isEdit)? this.isEdit = true: null;
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
        this.dispalayFormGroup.patchValue({
          country: gotcha[0].issueCountry,
          idtype: gotcha[0].idType,
          cardnumber: gotcha[0].idNumber,
          issuedate: gotcha[0].issueDate,
          taxnumber: gotcha[0].trn
        });
        (gotcha[0].deletedscandoc)? this.deletedscandoc = gotcha[0].deletedscandoc: null;
        this.uploadedimgs = gotcha[0].scandoc;
        this.secondFormGroup.patchValue({ scandoc: this.uploadedimgs });
      }, (ers) => {
        this.isEdit = true;
        console.log('Error while fetching data:' + ers);
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
  removeDoc(i) {
    if (this.isApproved) {
      this.deletedscandoc.push({image:this.uploadedimgs[i],time:Date.now()});
      this.uploadedimgs.splice(i,1);
      this.secondFormGroup.patchValue({scandoc: this.uploadedimgs});
    }
    else {
      this.uploadedimgs.splice(i,1);
      this.secondFormGroup.patchValue({scandoc: this.uploadedimgs});
    }
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
      deletedscandoc:this.deletedscandoc
    };

    let dialogRef = this.dialog.open(DeleteComponent, {
      data: { title: 'Want to Save ?', content: '' , class:'warn'},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.uid) {
          this.http.post(environment.api + '/userdocs/', obj)
            .subscribe((resp: any) => {
              var x = resp.json();
              this.snakebar.open('KYC Filled Successfully','',{duration: 5000});
              // this.toastr.success('KYC Filled Successfully', 'Success');
              this.router.navigate(['/dashboard']);
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
              this.router.navigate(['/dashboard']);
            }, (er) => {
              // this.toastr.error('Internal Server Error.', 'Error');
              this.snakebar.open('Internal Server Error.','',{duration: 5000});
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
