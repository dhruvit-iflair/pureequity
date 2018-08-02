import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { CoinBalanceService } from '../../shared/services/coinBalance.service';
import { CoinBalance, Balance } from '../buysell/buysell.component';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
    public tokendata;
    public transactions;
    public payamount:number = 0.00;
    public amounttype:string = 'USD';
    constructor(
        private http: Http,
        private router: Router,
        private toastr: ToastrService,
        public coinBalanceService: CoinBalanceService,
        public snakebar :MatSnackBar
    ) { }
    public payPalConfig: PayPalConfig;
    public coinBalance :CoinBalance;
    ngOnInit() {
        this.tokendata = JSON.parse(localStorage.getItem('token'));
        this.transaction();
        this.initConfig();
        this.coinBalanceService.coinBalance.subscribe(data=>{
            this.coinBalance = data
        });
        this.coinBalanceService.refreshCoinBalance();
    }
    papal(){
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
                var userd = this.tokendata.user.username;
                var pamount = this.payPalConfig.transactions[0].amount.total + ' ' + this.payPalConfig.transactions[0].amount.currency;
                let coinData = this.coinBalance;
                let checkBalance = this.coinBalance.balance.find(c=>c.coin.toLowerCase() === this.amounttype.toLowerCase());
                if (checkBalance) {
                    let index = coinData.balance.findIndex(c=>c.coin.toLowerCase() === this.amounttype.toLowerCase())
                    coinData.balance[index].balance = coinData.balance[index].balance + this.payamount;
                }
                else {
                    let b:any = {
                        coin:this.amounttype.toLowerCase(),
                        balance:this.payamount
                    }
                    coinData.balance.push(b);
                }
                console.log(coinData);
                let transaction:any = data;
                let token = JSON.parse(localStorage.getItem('token'));
                transaction.user = token.user._id;
                transaction.amount = {
                    amount : this.payamount,
                    currency : this.amounttype
                };
                transaction.status = "success";
                transaction.transaction_type = "paypal";
                this.coinBalanceService.saveTransaction(transaction).subscribe(
                    success => this.coinBalanceService.updateCoinBalance(coinData),
                    error => {
                        this.snakebar.open("Error Something went wrong", "", { duration: 5000 });
                    }
                )
                // var dataz = {
                //   title: 'PaypalDepositSuccess',
                //   search: ['[(paypal.user)]', '[(paypal.paymentID)]', '[(paypal.amount)]'],
                //   replace: [userd, data.paymentID, pamount],
                //   from: 'no_replay@pureequity.com',
                //   to: this.tokendata.user.username,
                //   respmessage: 'Please Check your mailbox for details about this payment!!'
                // };
                // this.http.post(environment.api + '/mails/send', dataz).subscribe((response: any) => {
                //   if (response) {
                //     this.toastr.success(response.message, 'Success');
                //   }
                // }, (error) => {
                //   this.toastr.error((error.error['message']) ? error.error.message : error.error, 'Error');
                //   console.log(error);
                // });
                // this.toastr.success('Payment Success!', 'Success');
            },
            onCancel: (data, actions) => {
                console.log('OnCancel');
                console.log(data);
                let transaction:any = data;
                let token = JSON.parse(localStorage.getItem('token'));
                transaction.user = token.user._id;
                transaction.amount = {
                    amount : this.payamount,
                    currency : this.amounttype
                };
                transaction.status = "cancel";
                transaction.transaction_type = "paypal";
                this.coinBalanceService.saveTransaction(transaction).subscribe(
                    success => console.log(success),
                    error => {
                        this.snakebar.open("Error Something went wrong", "", { duration: 5000 });
                    }
                )
            },
            onError: (err) => {
                console.log('OnError' + err);
                this.snakebar.open("Error Something went wrong", "", { duration: 5000 });
                let transaction:any;
                let token = JSON.parse(localStorage.getItem('token'));
                transaction.user = token.user._id;
                transaction.amount = {
                    amount : this.payamount,
                    currency : this.amounttype
                };
                transaction.status = "error";
                transaction.error = err;
                transaction.transaction_type = "paypal";
                this.coinBalanceService.saveTransaction(transaction).subscribe(
                    success => console.log(success),
                    error => {
                        this.snakebar.open("Error Something went wrong", "", { duration: 5000 });
                    }
                )
            },
            transactions: [{
                amount: {
                    currency: this.amounttype,
                    total: this.payamount
                }
            }]
        });
    }
    transaction() {
        this.http.get(environment.api + '/history/user/' + this.tokendata.user._id).subscribe((res: any) => {
            var tran = res.json();
            this.transactions = tran.transactions;
            console.log(this.transactions);
        }, (err: any) => {
            console.log(err);
        })
    }
}
