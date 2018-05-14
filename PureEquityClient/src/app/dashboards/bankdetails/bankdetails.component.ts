import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { DateAdapter, MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

//declare let paypal: any;
@Component({
  selector: 'app-bankdetails',
  templateUrl: './bankdetails.component.html',
  styleUrls: ['./bankdetails.component.css']
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

  constructor(private _formBuilder: FormBuilder, public dialog: MatDialog, private router: Router, private http: Http, private toastr: ToastrService) { }
  // public paypaldetails = {
  //   env: 'sandbox',
  //   intent:'Authorize',
  //   style: {
  //     label: 'paypal',
  //     size: 'medium',    // small | medium | large | responsive
  //     shape: 'rect',     // pill | rect
  //     color: 'blue',     // gold | blue | silver | black
  //     tagline: false
  //   },
  //   client: {
  //     sandbox: 'AV-PWSMJALApjufQP70Ww6FxMWJbhiFtGaJIfp6m1d9GB1pRnArmXKS4rw2toxOrkW5N1H3MRjboPkyM',
  //     production: '<your-production-key>'
  //   },
  //   payment: (data, actions) => {
  //     return actions.payment.create({
  //       payment: {
  //         trasactions: [{
  //           amount: { total: '50.00', currency: 'USD' }
  //         }]
  //       }
  //     });
  //   },
  //   onAuthorize: (data, actions) => {
  //     console.log('data:::::' + data);
  //     return actions.payment.execute().then((payment) => {
  //       console.log(payment);
  //       alert('success');
  //       this.router.navigate(['/timepassonsuccess']);
  //     });
  //   }
  // };
  ngOnInit() {
    this.bankdetails = this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      actype: ['', Validators.required],
      name: ['', Validators.required],
      bankdoctype: ['', Validators.required],
      isagreed: []
    });
    this.savedbankdetails = this._formBuilder.group({
      acnumber: ['', Validators.required],
      ifscnumber: ['', Validators.required],
      bankname: ['', Validators.required],
      amount: ['', Validators.required]
    });
    this.ccinfo = this._formBuilder.group({
      ccname: ['', Validators.required],
      ccnumber: ['', Validators.required],
      expmonth: ['', Validators.required],
      expyear: ['', Validators.required],
      cvvnumber: ['', Validators.required]
    });
    this.sccdetails = this._formBuilder.group({
      ccnumber: ['', Validators.required],
      cvvnumber: ['', Validators.required],
      amount: ['', Validators.required]
    });
    this.ppdetails = this._formBuilder.group({
      email: ['', Validators.required, Validators.email],
      pwd: ['', Validators.required]
    });
    this.sppdetails = this._formBuilder.group({
      semail: ['', Validators.required, Validators.email],
      amount: [null, Validators.required]
    });
    var tokendata = JSON.parse(localStorage.getItem('token'));
    if (tokendata.user.role.name != 'admin') {
      document.getElementById('customeCss').setAttribute('style', 'top: -7%;');
    }
    else {
      document.getElementById('customeCss').setAttribute('style', 'top: -9%;');
    }
    this.initConfig();
    //this.getInitialData();
    //paypal.Button.render(this.paypaldetails, '#btnPaypal');
  }
  public payPalConfig:PayPalConfig;
  private initConfig(): void {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        //sandbox: 'Aeamyh5lUwM_7UJ315iLUfUyzpSFM0CcUYrRT3AWQ_ZgUw8paOZ3wWy_kVvNBCecx-Ow1PPm48JMWiQp'
        sandbox: 'AVqzRIHlt-B85qMxjL6_GDHYaVp5djMAXVL7ecX4BRySstGdryEJOpPT9eYKKIKihIf3KEo-RMfkl76h'
        //sandbox: 'ATNZuTAAZ0D_PYa_B_TrT2bzYRNhBBgE-QZIvAPGZGfS4RM_W-U6kRbFvjcGNgp0hicne7_jKwsYiLaU'
      },
      button: {
        label: 'paypal',
      },
      onPaymentComplete: (data, actions) => {
        console.log(data);
        console.log('OnPaymentComplete');
        console.log(actions);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      },
      transactions: [{
        amount: {
          currency: 'GBP',
          total: 1100.55
        }
      }]
    });
  }

uploaddocs() {
  this.toastr.warning('Test Success!');
}
checkifsc() {
  this.toastr.success('Test Success!');
}
}
