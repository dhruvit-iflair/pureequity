import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "ng2-validation";
import { Http } from "@angular/http";
import { environment } from "../../../../environments/environment";
import {
    PayPalConfig,
    PayPalEnvironment,
    PayPalIntegrationType
} from "ngx-paypal";
import { MatSnackBar } from "@angular/material";
import { CoinBalanceService } from "../../shared/services/coinBalance.service";
import { find } from "rxjs/operator/find";

@Component({
    selector: "app-buysell",
    templateUrl: "./buysell.component.html",
    styleUrls: ["./buysell.component.css"]
})
export class BuysellComponent implements OnInit {
    public buysellForm: FormGroup;
    public sellForm: FormGroup;
    public coinBalance: CoinBalance;
    constructor(
        private fb: FormBuilder,
        private http: Http,
        private router: Router,
        private snakebar: MatSnackBar,
        private toastr: ToastrService,
        public coinBalanceService: CoinBalanceService
    ) { }
    availableBalanceBuy;
    availableBalanceSell;
    pureequityfee = "0.25%";
    enablesellcontainer = false;
    enablebuycontainer = false;
    bidprice: any;
    chipsValue = "btcusd";
    availBalance: any;
    orderbook: any;
    estimate: any;
    fees: any;
    private history: any;
    public payPalConfig: PayPalConfig;
    public tradeCoin: String = "BTC / USD";
    public tradeList: any[] = [
        { name: "BTC / USD", isActive: true, value: "btcusd", data: [] },
        { name: "BTC / EUR", isActive: false, value: "btceur", data: [] },
        { name: "EUR / USD", isActive: false, value: "eurusd", data: [] },
        { name: "XRP / USD", isActive: false, value: "xrpusd", data: [] },
        { name: "XRP / EUR", isActive: false, value: "xrpeur", data: [] },
        { name: "XRP / BTC", isActive: false, value: "xrpbtc", data: [] },
        { name: "LTC / USD", isActive: false, value: "ltcusd", data: [] },
        { name: "LTC / EUR", isActive: false, value: "ltceur", data: [] },
        { name: "LTC / BTC", isActive: false, value: "ltcbtc", data: [] },
        { name: "ETH / USD", isActive: false, value: "ethusd", data: [] },
        { name: "ETH / EUR", isActive: false, value: "etheur", data: [] },
        { name: "ETH / BTC", isActive: false, value: "ethbtc", data: [] },
        { name: "BCH / USD", isActive: false, value: "bchusd", data: [] },
        { name: "BCH / EUR", isActive: false, value: "bcheur", data: [] },
        { name: "BCH / BTC", isActive: false, value: "bchbtc", data: [] }
    ];
    public sideNave: any[] = [
        { name: "Instant Order (Simple)", isActive: true },
        { name: "Limit Order (Advanced)", isActive: false },
        { name: "Market Order (Advanced)", isActive: false },
        { name: "Stop Order (Advanced)", isActive: false }
    ];
    tokendata;
    public buydata: any = {
        subtotal: 0,
        estimation: 0
    }
    public selldata: any = {
        subtotal: 0,
        estimation: 0
    }
    public calcBuyS: any;
    public calcSellS: any;
    public current_payload: any;
    ngOnInit() {
        this.buysellForm = this.fb.group({
            amount: [null, Validators.compose([Validators.required])],
            subtotal: [null],
            fee: [this.pureequityfee],
            estimation: [null]
        });
        this.sellForm = this.fb.group({
            amount: [null, Validators.compose([Validators.required])],
            subtotal: [null],
            fee: [this.pureequityfee],
            estimation: [null]
        });
        this.initConfig();
        var token = JSON.parse(localStorage.getItem("token"));
        this.tokendata = token;
        this.http
            .get(environment.api + "/history/user/" + token.user._id)
            .subscribe(
                (res: any) => {
                    var d = res.json();
                    if (d && d.transactions) {
                        this.history = d;
                    }
                },
                error => {
                    console.log(error);
                }
            );
        // this.http.get(environment.tradingApi + "/balance/btcusd").subscribe(
        //     resp => {
        //         this.availBalance = resp.json();
        //         console.log(this.availBalance);
        //         this.availableBalanceBuy =
        //             this.availBalance.payload.data.usd_available + " USD";
        //         this.availableBalanceSell =
        //             this.availBalance.payload.data.btc_available + " BTC";
        //     },
        //     er => {
        //         var err = er.json();
        //         console.log(err);
        //     }
        // );
        this.buysellForm.valueChanges.subscribe((data) => {
            this.calcBuy();
        })
        this.sellForm.valueChanges.subscribe((data) => {
            this.calcSell();
        })        // setInterval(() => {
        //   this.orders();
        // }, 10000);

        this.coinBalanceService.coinBalance.subscribe(data => {
            this.coinBalance = data
            console.log(this.coinBalance);
            this.setBalance(this.chipsValue);
        });
        this.coinBalanceService.refreshCoinBalance();
    }

    orders() {
        this.http.get(environment.tradingApi + "/orderBook/btcusd").subscribe(
            resp => {
                this.orderbook = resp.json();
            },
            er => {
                var err = er.json();
                console.log(err);
            }
        );
    }
    setBalance(coinval) {
        console.log(coinval.slice(0, 3), coinval.slice(3, 6));
        // this.coinBalanceService.refreshCoinBalance();
        let balanceBuy = this.coinBalance.balance.find(bal => bal.coin.toLowerCase() === coinval.slice(3, 6).toLowerCase());
        let balanceSell = this.coinBalance.balance.find(bal => bal.coin.toLowerCase() === coinval.slice(0, 3).toLowerCase());
        console.log(balanceBuy, balanceSell);
        this.availableBalanceBuy = (balanceBuy) ? balanceBuy.balance + ' ' + coinval.slice(3, 6).toUpperCase() : "0 " + coinval.slice(3, 6).toUpperCase();
        this.availableBalanceSell = (balanceSell) ? balanceSell.balance + ' ' + coinval.slice(0, 3).toUpperCase() : "0 " + coinval.slice(0, 3).toUpperCase();
        // this.availableBalanceBuy = (balanceBuy)? balanceBuy +  coinval.slice(0,3).toUpperCase();
        // this.availableBalanceSell = this.coinBalance.balance.find(bal =>{
        //     return bal.coin == coinval.slice(3,6);
        // }) +  coinval.slice(3,6).toUpperCase();

        // this.http.get(environment.tradingApi + "/balance/" + coinval).subscribe(
        //     resp => {
        //         this.availBalance = resp.json();
        //         var key1 = Object.keys(this.availBalance.payload.data)[0];
        //         var key2 = Object.keys(this.availBalance.payload.data)[4];
        //         var lbl1 = key1.split("_");
        //         var lbl2 = key2.split("_");
        //         console.log(key1,key2);
        //         this.availableBalanceBuy =
        //             this.availBalance.payload.data[key1] + " " + lbl1[0].toUpperCase();
        //         this.availableBalanceSell =
        //             this.availBalance.payload.data[key2] + " " + lbl2[0].toUpperCase();
        //     },
        //     er => {
        //         var err = er.json();
        //         console.log(err);
        //     }
        // );
    }

    toggleValue(i) {
        if (!this.tradeList[i].isActive) {
            this.tradeList.map(t => {
                t.isActive = false;
            });
            this.tradeList[i].isActive = !this.tradeList[i].isActive;
            this.tradeCoin = this.tradeList[i].name;
            this.chipsValue = this.tradeList[i].value;
            this.setBalance(this.chipsValue);
            this.calcBuy();
            this.calcSell();
        }
    }
    toggleSideMenu(i) {
        if (!this.sideNave[i].isActive) {
            this.sideNave.map(t => {
                t.isActive = false;
            });
            this.sideNave[i].isActive = !this.sideNave[i].isActive;
        }
    }
    buybtc() {
        let trans = {
            transaction_type: "IOB",
            time: Date.now(),
            account: "Main Account",
            amount: {
                amount: this.buysellForm.value.amount,
                currency: this.tradeCoin.slice(6, 9)
            },
            subtotal: {
                amount: this.buydata.subtotal,
                currency: this.tradeCoin.slice(0, 3)
            },
            value: {
                amount: this.buydata.estimation,
                currency: this.tradeCoin.slice(0, 3)
            },
            rate: {
                amount: this.current_payload.payload.data.ask,
                currency: this.tradeCoin.slice(6, 9)
            },
            fees: {
                amount: this.buysellForm.value.amount - this.buydata.subtotal,
                currency: this.tradeCoin.slice(6, 9)
            }
        }
        this.coinBalanceService.saveTransaction(trans).subscribe(
            success => {
                console.log(trans);
                let checkAvailableBalance = this.coinBalance.balance.find(c=>c.coin.toLowerCase() === this.tradeCoin.slice(6, 9).toLowerCase());
                let balance:any = this.coinBalance
                console.log(checkAvailableBalance);
                if (checkAvailableBalance && checkAvailableBalance.balance > this.buysellForm.value.amount) {
                    let buyBalIndex = balance.balance.findIndex(c=>c.coin.toLowerCase() === this.tradeCoin.slice(6, 9).toLowerCase())
                    balance.balance[buyBalIndex].balance = parseFloat(balance.balance[buyBalIndex].balance) - parseFloat(this.buysellForm.value.amount);

                    let sellBalIndex = balance.balance.findIndex(c=>c.coin.toLowerCase() === this.tradeCoin.slice(0, 3).toLowerCase())
                    if (sellBalIndex > -1) {
                        balance.balance[sellBalIndex].balance = parseFloat(balance.balance[sellBalIndex].balance) + parseFloat(this.buydata.estimation);
                    }
                    else {
                        let b:any = {
                            coin:this.tradeCoin.slice(0, 3).toLowerCase(),
                            balance : this.buydata.estimation
                        }
                        balance.balance.push(b);
                    }
                    this.coinBalanceService.updateCoinBalance(balance);
                }
                else {
                    this.snakebar.open(`You account does not contail sufficent ${this.tradeCoin.slice(6, 9).toUpperCase()} to buy ${this.tradeCoin.slice(0, 3).toUpperCase()}`, "", { duration: 5000 });
                }
            },
            error => {
                this.snakebar.open("Error Something went wrong please try again later", "", { duration: 5000 });
            }
        )
    }
    sellbtc() {
        let trans = {
            transaction_type: "IOS",
            time: Date.now(),
            account: "Main Account",
            amount: {
                amount: this.sellForm.value.amount,
                currency: this.tradeCoin.slice(0,3)
            },
            subtotal: {
                amount: this.selldata.subtotal,
                currency:  this.tradeCoin.slice(6,9)
            },
            value: {
                amount: this.selldata.estimation,
                currency:  this.tradeCoin.slice(6,9)
            },
            rate: {
                amount:  this.current_payload.payload.data.bid,
                currency: this.tradeCoin.slice(6,9)
            },
            fees: {
                amount: this.selldata.subtotal - this.selldata.estimation,
                currency: this.tradeCoin.slice(6,9)
            }
        }
        console.log(trans);
        // this.coinBalanceService.saveTransaction(trans).subscribe(
        //     success => {
        //         console.log(trans);
        //         let checkAvailableBalance = this.coinBalance.balance.find(c=>c.coin.toLowerCase() === this.tradeCoin.slice(6, 9).toLowerCase());
        //         let balance:any = this.coinBalance
        //         console.log(checkAvailableBalance);
        //         if (checkAvailableBalance && checkAvailableBalance.balance > this.buysellForm.value.amount) {
        //             let buyBalIndex = balance.balance.findIndex(c=>c.coin.toLowerCase() === this.tradeCoin.slice(6, 9).toLowerCase())
        //             balance.balance[buyBalIndex].balance = parseFloat(balance.balance[buyBalIndex].balance) - parseFloat(this.buysellForm.value.amount);

        //             let sellBalIndex = balance.balance.findIndex(c=>c.coin.toLowerCase() === this.tradeCoin.slice(0, 3).toLowerCase())
        //             if (sellBalIndex > -1) {
        //                 balance.balance[sellBalIndex].balance = parseFloat(balance.balance[sellBalIndex].balance) + parseFloat(this.buydata.estimation);
        //             }
        //             else {
        //                 let b:any = {
        //                     coin:this.tradeCoin.slice(0, 3).toLowerCase(),
        //                     balance : this.buydata.estimation
        //                 }
        //                 balance.balance.push(b);
        //             }
        //             this.coinBalanceService.updateCoinBalance(balance);
        //         }
        //         else {
        //             this.snakebar.open(`You account does not contail sufficent ${this.tradeCoin.slice(6, 9).toUpperCase()} to buy ${this.tradeCoin.slice(0, 3).toUpperCase()}`, "", { duration: 5000 });
        //         }
        //     },
        //     error => {
        //         this.snakebar.open("Error Something went wrong please try again later", "", { duration: 5000 });
        //     }
        // )
    }

    public initConfig(): void {
        this.payPalConfig = new PayPalConfig(
            PayPalIntegrationType.ClientSideREST,
            PayPalEnvironment.Sandbox,
            {
                commit: true,
                client: {
                    //sandbox: 'Aeamyh5lUwM_7UJ315iLUfUyzpSFM0CcUYrRT3AWQ_ZgUw8paOZ3wWy_kVvNBCecx-Ow1PPm48JMWiQp'
                    sandbox:
                        "AVqzRIHlt-B85qMxjL6_GDHYaVp5djMAXVL7ecX4BRySstGdryEJOpPT9eYKKIKihIf3KEo-RMfkl76h"
                    //sandbox: 'ATNZuTAAZ0D_PYa_B_TrT2bzYRNhBBgE-QZIvAPGZGfS4RM_W-U6kRbFvjcGNgp0hicne7_jKwsYiLaU'
                },
                button: {
                    label: "paypal"
                },
                onPaymentComplete: (data, actions) => {
                    console.log(data);
                    console.log("OnPaymentComplete");
                    console.log(actions);
                    this.toastr.success("Payment Success!", "Success");
                },
                onCancel: (data, actions) => {
                    console.log("OnCancel");
                    this.toastr.warning("Cancelled!", "Cancelled!");
                },
                onError: err => {
                    console.log("OnError" + err);
                    this.toastr.error("Something Went Wrong!", "Error");
                },
                transactions: [
                    {
                        amount: {
                            currency: "GBP",
                            total: 1100.55
                        }
                    }
                ]
            }
        );
    }
    saveHistory(data) {
        if (data["_id"]) {
            this.http.put(environment.api + "/history/" + data._id, data).subscribe(
                (res: any) => {
                    console.log(res);
                    this.history = res.json();
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.http.post(environment.api + "/history", data).subscribe(
                (res: any) => {
                    console.log(res);
                    this.history = res.json();
                },
                error => {
                    console.log(error);
                }
            );
        }
    }
    // estimation(container) {
    //     let a = this.buysellForm.value
    //     if (a.amount > 0) {
    //         this.calcBuy();
    //     }
    // }
    // estSell() {
    //     let a = this.sellForm.value;
    //     if (a.amount > 0) {
    //         this.calcSell();
    //     }
    // }
    calcBuy() {
        let allVal = this.buysellForm.value;
        if (allVal.amount > 0) {
            (this.calcBuyS) ? this.calcBuyS.unsubscribe() : null;
            this.calcBuyS = this.http
                .get(environment.tradingApi + "/coins/" + this.chipsValue)
                .subscribe(data => {
                    this.current_payload = data.json();

                    let payload = data.json();
                    let subtotal =
                        allVal.amount -
                        ((allVal.amount * parseFloat(this.pureequityfee)) / 100);
                    let approx = subtotal / payload.payload.data.ask;
                    var newCac = {
                        subtotal: subtotal.toFixed(8),
                        estimation: approx.toFixed(8)
                    };
                    // this.buysellForm.patchValue(newCac);
                    this.buydata = newCac;
                });
        }
    }
    calcSell() {
        let allVal = this.sellForm.value;
        if (allVal.amount > 0) {
            (this.calcSellS) ? this.calcSellS.unsubscribe() : null;
            this.calcSellS = this.http
                .get(environment.tradingApi + "/coins/" + this.chipsValue)
                .subscribe(data => {
                    this.current_payload = data.json();
                    let payload = data.json();
                    let subtotal = allVal.amount * payload.payload.data.bid;
                    let approx = subtotal - ((subtotal * parseFloat(this.pureequityfee)) / 100);
                    var newCac = {
                        subtotal: subtotal.toFixed(8),
                        estimation: approx.toFixed(8)
                    };
                    // this.sellForm.patchValue(newCac);
                    this.selldata = newCac;
                });

        }
    }
}
// buybtc() {
//     if (this.history && this.history.transactions) {
//         this.history.transactions.push({
//             transaction_type: "IOB",
//             time: Date.now(),
//             account: "Main Account",
//             amount: {
//                 amount: this.buysellForm.value.amount,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             value: {
//                 amount: this.buydata.subtotal,
//                 currency: this.tradeCoin.slice(0,3)
//             },
//             rate: {
//                 amount: this.current_payload.payload.data.ask,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             fees: {
//                 amount: this.buysellForm.value.amount - this.buydata.subtotal ,
//                 currency: this.tradeCoin.slice(6,9)
//             }
//         });
//     } else {
//         var token = JSON.parse(localStorage.getItem("token"));
//         var transactions = [];
//         transactions.push({
//             transaction_type: "IOB",
//             time: Date.now(),
//             account: "Main Account",
//             amount: {
//               amount: this.buysellForm.value.amount,
//               currency: this.tradeCoin.slice(6,9)
//             },
//             value: {
//                 amount: this.buydata.subtotal,
//                 currency: this.tradeCoin.slice(0,3)
//             },
//             rate: {
//                 amount: this.current_payload.payload.data.ask,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             fees: {
//                 amount: this.buysellForm.value.amount - this.buydata.subtotal ,
//                 currency: this.tradeCoin.slice(6,9)
//             }
//         });
//         this.history = {
//             transactions: transactions,
//             user: token.user._id
//         };
//     }
//     if (this.tokendata.user.is2FAEnabled) {
//         // this.saveHistory(this.history);
//         var amountval = parseFloat(this.buysellForm.value.amount).toFixed(6);
//         var obj = { amount: parseFloat(amountval), price: this.current_payload.payload.data.ask };
//         console.log(obj);
//         this.http.post(environment.tradingApi + '/buyInstant/'+this.chipsValue , obj)
//             .subscribe((resp) => {
//                 console.log(resp);
//                 // this.toastr.success('Transactions Success');
//                 this.snakebar.open("Transactions Success", "", { duration: 5000 });
//             }, (er) => {
//                 var err = er.json();
//                 console.log(err);
//                 this.snakebar.open(err.message, "", { duration: 5000 });
//                 // this.toastr.error(err.message, 'Error');
//             });
//     } else {
//         this.snakebar.open(
//             "You are requested to enable 2FA from security to keep using Pure Equity platform.",
//             "",
//             { duration: 5000 }
//         );
//     }
// }
// sellbtc() {
//     if (this.history && this.history.transactions) {
//         this.history.transactions.push({
//             transaction_type: "IOS",
//             time: Date.now(),
//             account: "Main Account",
//             amount: {
//                 amount: this.sellForm.value.amount,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             value: {
//                 amount: this.selldata.subtotal,
//                 currency:  this.tradeCoin.slice(0,3)
//             },
//             rate: {
//                 amount:  this.current_payload.payload.data.bid,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             fees: {
//                 amount: this.selldata.subtotal - this.selldata.estimation,
//                 currency: this.tradeCoin.slice(6,9)
//             }
//         });
//     } else {
//         var token = JSON.parse(localStorage.getItem("token"));
//         var transactions = [];
//         transactions.push({
//             transaction_type: "IOS",
//             time: Date.now(),
//             account: "Main Account",
//             amount: {
//                 amount: this.sellForm.value.amount,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             value: {
//                 amount: this.selldata.subtotal,
//                 currency:  this.tradeCoin.slice(0,3)
//             },
//             rate: {
//                 amount:  this.current_payload.payload.data.bid,
//                 currency: this.tradeCoin.slice(6,9)
//             },
//             fees: {
//                 amount: this.sellForm.value.amount - this.selldata.subtotal,
//                 currency: this.tradeCoin.slice(6,9)
//             }
//         });
//         this.history = {
//             transactions: transactions,
//             user: token.user._id
//         };
//     }
//     if (this.tokendata.user.is2FAEnabled) {
//         // this.saveHistory(this.history);
//         let amountval = parseFloat(this.sellForm.value.amount).toFixed(6);
//         let obj = { amount: parseFloat(amountval), price: this.current_payload.payload.data.bid };
//         console.log(obj);
//         // let obj = {amount:this.buysellForm.value.amount,price:this.bidprice};
//         this.http.post(environment.tradingApi + '/sellInstant/'+ this.chipsValue, obj)
//             .subscribe((resp) => {
//                 console.log(resp);
//                 this.snakebar.open("Transactions Success", "", { duration: 5000 });
//             }, (er) => {
//                 var err = er.json();
//                 console.log(err);
//                 this.snakebar.open(err.message, "", { duration: 5000 });
//                 // this.toastr.error(err.message, 'Error');
//             });
//     } else {
//         this.snakebar.open(
//             "You are requested to enable 2FA from security to keep using Pure Equity platform.",
//             "",
//             { duration: 5000 }
//         );
//     }
// }
// estimation(enablebuycontainer) {
//   this.http
//       .get(environment.tradingApi + "/coins/" + this.chipsValue)
//       .subscribe(data => {
//           var respdata = data.json();
//           this.bidprice = parseFloat(respdata.payload.data.ask);
//           // this.estimate = respdata.payload.data;
//           if (enablebuycontainer) {
//               var tempval = parseFloat(this.pureequityfee) / 100;
//               var subtotal = parseFloat(this.buysellForm.value.amount) - tempval;
//               var estbtc = subtotal / this.bidprice;
//               //this.fees = this.buysellForm.value.amount - subtotal;
//               this.buysellForm.patchValue({
//                   subtotal: subtotal,
//                   estimation: estbtc
//               });
//           } else {
//               //var tempval= parseFloat(this.pureequityfee)/100;
//               var subtotl = parseFloat(this.sellForm.value.amount);
//               //var deductableusd = subtotl * parseFloat(this.pureequityfee) / 100;
//               var estusd = subtotl / this.bidprice;
//               //this.fees = deductableusd;
//               this.sellForm.patchValue({ subtotal: subtotl, estimation: estusd });
//           }
//       });
// }

export interface CoinBalance {
    user: String,
    balance: Array<Balance>,
    created_at: Date,
    updated_at: Date,
    createdBy: String,
    updatedBy: String
}
export interface Balance {
    coin: String,
    balance: number,
    _id: false,
}
