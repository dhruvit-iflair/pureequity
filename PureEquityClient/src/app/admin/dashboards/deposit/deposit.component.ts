import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  public tokendata;
  constructor(private http: Http, private router: Router, private toastr: ToastrService) { }
  public payPalConfig: PayPalConfig;
  ngOnInit() {
    this.tokendata= JSON.parse(localStorage.getItem('token'));
    this.initConfig();
  }
  public initConfig(): void {
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
        var userd=this.tokendata.user.username;
        var pamount=this.payPalConfig.transactions[0].amount.total+' '+this.payPalConfig.transactions[0].amount.currency;
        var dataz = {
          title: 'PaypalDepositSuccess',
          search: ['[(paypal.user)]', '[(paypal.paymentID)]', '[(paypal.amount)]'],
          replace: [userd, data.paymentID, pamount],
          from: 'no_replay@pureequity.com',
          to: this.tokendata.user.username,
          respmessage: 'Please Check your mailbox for details about this payment!!'
        };
        this.http.post(environment.api + '/mails/send', dataz).subscribe((response: any) => {
          if (response) {
            this.toastr.success(response.message, 'Success');
          }
        }, (error) => {
          this.toastr.error((error.error['message']) ? error.error.message : error.error, 'Error');
          console.log(error);
        });
        this.toastr.success('Payment Success!', 'Success');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
        this.toastr.error('You just cancelled your Transaction!', 'Error');
      },
      onError: (err) => {
        console.log('OnError' + err);
        this.toastr.error('Something Went Wrong!', 'Error');
      },
      transactions: [{
        amount: {
          currency: 'GBP',
          total: 1100.55
        }
      }]
    });
  }
}
