import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { CoinBalanceService } from '../../shared/services/coinBalance.service';
import { CoinBalance, Balance } from '../buysell/buysell.component';
import { MatSnackBar } from '@angular/material';
import { CoinsService } from '../../shared/services/coins.service';
import { MoneyService } from '../../shared/services/money.service';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
    public tokendata;
    public transactions;
    public payamount:number = 1;
    public amounttype:string = 'USD';
    public cb:any; public gt :any;
    constructor(
        private http: Http,
        private router: Router,
        private toastr: ToastrService,
        // public coinBalanceService: CoinBalanceService,
        public moneyService:MoneyService,
        public snakebar :MatSnackBar
    ) { }
    public payPalConfig: PayPalConfig;
    public coinBalance :CoinBalance;
    ngOnInit() {
        this.tokendata = JSON.parse(localStorage.getItem('token'));
        this.initConfig();
        this.cb = this.moneyService.getMoneyBalance().subscribe(data=>{
            this.coinBalance = data
        });
        this.moneyService.refreshMoneyBalance();
        this.gt = this.moneyService.getMoneyTransactions().subscribe((data:any[])=>{
            let ppTrans = data.filter(x=> x.transaction_type == 'paypal');
            this.transactions = this.sortData(ppTrans)
        });
        this.moneyService.refreshMoneyTransaction();
    }
    papal(){
        this.initConfig();
    }
    ngOnDestroy() {
        this.cb.unsubscribe();
        this.gt.unsubscribe();
    }
    sortData(data:any){
        return data.sort((a, b) => {
            let aDate: Date = new Date(a.created_at);
            let bDate: Date = new Date(b.created_at);
            // console.log(aDate.getTime());
            return bDate.getTime() - aDate.getTime();
        });
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
                let moneyBalance = this.coinBalance;
                let checkBalance = this.coinBalance.balance.find(c=>c.coin.toLowerCase() === this.amounttype.toLowerCase());
                if (checkBalance) {
                    let index = moneyBalance.balance.findIndex(c=>c.coin.toLowerCase() === this.amounttype.toLowerCase())
                    moneyBalance.balance[index].balance = moneyBalance.balance[index].balance + this.payamount;
                }
                else {
                    let b:any = {
                        coin:this.amounttype.toLowerCase(),
                        balance:this.payamount
                    }
                    moneyBalance.balance.push(b);
                }
                console.log(moneyBalance);
                let transaction:any = data;
                let token = JSON.parse(localStorage.getItem('token'));
                transaction.user = token.user._id;
                transaction.amount = {
                    amount : this.payamount,
                    currency : this.amounttype
                };
                transaction.status = "success";
                transaction.transaction_type = "paypal";

                this.moneyService.addMoneyTransaction(transaction).subscribe(
                    tranSuccess =>{
                        this.moneyService.updateMoneyBalance(moneyBalance).subscribe(
                            success => {
                                this.moneyService.refreshMoneyTransaction();
                                this.snakebar.open("Transaction Successfull", "", { duration: 3000 });
                            },
                            error => {
                                this.snakebar.open("Error Something went wrong", "", { duration: 3000 });
                            }
                        )
                    },
                    error =>{
                        this.snakebar.open("Error Something went wrong", "", { duration: 5000 });
                        console.log(error)
                    }
                )
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

                this.moneyService.addMoneyTransaction(transaction).subscribe(
                    tranSuccess =>{
                               this.moneyService.refreshMoneyTransaction();
                                this.snakebar.open("Transaction Cancel", "", { duration: 3000 });
                    },
                    error =>{
                        this.snakebar.open("Error Something went wrong", "", { duration: 5000 });
                        console.log(error)
                    }
                )
            },
            onError: (err) => {
                console.log('OnError' + err);
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
                this.moneyService.addMoneyTransaction(transaction).subscribe(
                    success => {
                        console.log(success);
                        this.snakebar.open("Error Something went wrong", "", { duration: 3000 });
                        this.moneyService.refreshMoneyTransaction();
                    },
                    error => {
                        this.snakebar.open("Error Something went wrong", "", { duration: 3000 });
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
}
