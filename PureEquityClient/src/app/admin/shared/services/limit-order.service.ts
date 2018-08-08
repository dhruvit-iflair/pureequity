import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { TradeService, TradeRecord } from "./trade.service";
import { Subject } from "rxjs/Subject";
import { CoinsService } from "./coins.service";
import { MoneyService } from "./money.service";
import {
    CoinBalance,
    Balance
} from "../../dashboards/buysell/buysell.component";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class LimitOrderService {
    public coinTradeData: any;
    public buyCalcRequest: any;
    public sellCalcRequest: any;
    public fees: any = 0.25;
    public activeTrade: TradeRecord;
    public coinBalance: CoinBalance;
    public moneyBalance: CoinBalance;
    public activeCoinBalance: Balance;
    public activeMoneyBalance: Balance;

    public calcBuyS: any;
    public activeTradeSub: any;
    public coinBSub: any;
    public moneyBSub: any;

    constructor(
        public snakbar: MatSnackBar,
        private http: HttpClient,
        public tradeService: TradeService,
        public coinService: CoinsService,
        public moneyService: MoneyService
    ) {
        this.activeTrade = {
            name: "BTC / USD",
            isActive: true,
            value: "btcusd",
            data: []
        };
        this.ngOnInit();
    }

    ngOnInit() {
        if (!this.activeTradeSub) {
            this.activeTradeSub = this.tradeService
                .getActiveTrade()
                .subscribe(activeTrade => {
                    this.activeTrade = activeTrade;
                    console.log(activeTrade);
                });
        }
        this.coinBSub = this.coinService.getCoinBalance().subscribe(bal => {
            this.coinBalance = bal;
            this.setCoinBalance();
        });
        // this.coinService.refreshCoinBalance();

        this.moneyBSub = this.moneyService.getMoneyBalance().subscribe(bal => {
            this.moneyBalance = bal;
            this.setMoneyBalance();
        });
        // this.moneyService.refreshMoneyBalance();
    }

    ngOnDestroy() {
        if (this.activeTradeSub) {
            this.activeTradeSub.unsubscribe();
        }
        if (this.coinBSub) {
            this.coinBSub.unsubscribe();
        }
        if (this.moneyBSub) {
            this.moneyBSub.unsubscribe();
        }
    }

    buyLimitOrder(amount:any, buyPrice:any, total:any){
        // type = sellLimit
        // amount: "Amount to Buy",
		// price: "ASK price from ticker",
		// limitPrice:"Entered by User",
        // TODO Later.
        let payload = {};

        this.callHttp(payload,'sellLimit').subscribe((limitOrderResponse: any) => {
            this.buyCoinTransaction(amount,limitOrderResponse,'LIB','success').subscribe((cTSuccess: any) => {
                console.log("cTSuccess",cTSuccess);
                this.coinService.refreshCoinTransaction();
            },(er:any)=>{
                console.log(er);
            });
            this.buyMoneyTransaction(amount,limitOrderResponse,'LIB','success').subscribe((mTSuccess: any) => {
                console.log("mTSuccess",mTSuccess);
                this.moneyService.refreshMoneyTransaction();
            },(er:any)=>{
                console.log(er);
            });
            this.buyUpdateMoneyBalance(amount).subscribe((mBSuccess:any)=>{
                console.log("mBSuccess",mBSuccess);
                this.coinService.refreshCoinBalance();
            },(er:any)=>{
                console.log(er);
            });
            this.buyUpdateCoinBalance(amount,limitOrderResponse).subscribe((cb:any)=>{
                console.log("cb",cb);
                this.moneyService.refreshMoneyBalance();
            },(er:any)=>{
                console.log(er);
            });
        },
        (er:any)=>{
            console.log(er.error.message);
            this.buyCoinTransaction(amount,false,'LIB','error').subscribe((cTSuccess: any) => {
                this.coinService.refreshCoinTransaction();
                this.coinService.refreshCoinBalance();
            },(er:any)=>{
                console.log(er);
            });
            this.buyMoneyTransaction(amount,false,'LIB','error').subscribe((mTSuccess: any) => {
                this.moneyService.refreshMoneyBalance();
                this.moneyService.refreshMoneyTransaction();
            },(er:any)=>{
                console.log(er);
            });
        });


    }
    sellLimitOrder(amount:any, buyPrice:any, total:any){
        // type = buyInstant
        // TODO Later.
        // amount: "Amount to Buy",
		// price: "ASK price from ticker",
		// limitPrice:"Entered by User",
        let payload = {};

        this.callHttp(payload,'buyInstant').subscribe((limitOrderResponse: any) => {
            this.sellCoinTransaction(amount,limitOrderResponse,'LIS','success').subscribe((cTSuccess: any) => {
                console.log("cTSuccess",cTSuccess);
                this.coinService.refreshCoinTransaction();
            },(er:any)=>{
                console.log(er);
            });
            this.sellMoneyTransaction(amount,limitOrderResponse,'LIS','success').subscribe((mTSuccess: any) => {
                console.log("mTSuccess",mTSuccess);
                this.moneyService.refreshMoneyTransaction();
            },(er:any)=>{
                console.log(er);
            });
            this.sellUpdateMoneyBalance(amount).subscribe((mBSuccess:any)=>{
                console.log("mBSuccess",mBSuccess);
                this.coinService.refreshCoinBalance();
            },(er:any)=>{
                console.log(er);
            });
            this.sellUpdateCoinBalance(amount,limitOrderResponse).subscribe((cb:any)=>{
                console.log("cb",cb);
                this.moneyService.refreshMoneyBalance();
            },(er:any)=>{
                console.log(er);
            });
        },
        (er:any)=>{
            console.log(er.error.message);
            this.sellCoinTransaction(amount,false,'LIS','error').subscribe((cTSuccess: any) => {
                this.coinService.refreshCoinTransaction();
                this.coinService.refreshCoinBalance();
            },(er:any)=>{
                console.log(er);
            });
            this.sellMoneyTransaction(amount,false,'LIS','error').subscribe((mTSuccess: any) => {
                this.moneyService.refreshMoneyBalance();
                this.moneyService.refreshMoneyTransaction();
            },(er:any)=>{
                console.log(er);
            });
        });
    }
    callHttp(payload: any, type: any){
        return this.http.post(environment.tradingApi +`/${type}/` +this.activeTrade.value,payload)
    }

    setCoinBalance() {
        let cb_1 = this.coinBalance.balance.find(
            cb =>
                cb.coin.toLowerCase() ===
                this.activeTrade.value.slice(0, 3).toLowerCase()
        );
        let cb_2 = this.coinBalance.balance.find(
            cb =>
                cb.coin.toLowerCase() ===
                this.activeTrade.value.slice(3, 6).toLowerCase()
        );
        cb_1 && !cb_2 ? (this.activeCoinBalance = cb_1) : null;
        !cb_1 && cb_2 ? (this.activeMoneyBalance = cb_2) : null;
        if (cb_1 && cb_2) {
            this.activeMoneyBalance = cb_2;
            this.activeCoinBalance = cb_1;
        }
    }

    setMoneyBalance() {
        let mb_1 = this.moneyBalance.balance.find(
            cb =>
                cb.coin.toLowerCase() ===
                this.activeTrade.value.slice(3, 6).toLowerCase()
        );
        let mb_2 = this.moneyBalance.balance.find(
            cb =>
                cb.coin.toLowerCase() ===
                this.activeTrade.value.slice(0, 3).toLowerCase()
        );
        mb_1 && !mb_2 ? (this.activeMoneyBalance = mb_1) : null;
        mb_2 && !mb_1 ? (this.activeCoinBalance = mb_2) : null;
        if (mb_1 && mb_2) {
            this.activeMoneyBalance = mb_1;
            this.activeCoinBalance = mb_2;
        }
    }
    buyCoinTransaction(amount: any, limitOrderResponse: any, transaction_type: any,status: any){
        let token = JSON.parse(localStorage.getItem("token"));
        let coin_tran: any ={};
        if (limitOrderResponse) {
            coin_tran = {
                user: token.user._id,
                amount: {
                    amount: amount,
                    currency: this.activeCoinBalance
                        .coin
                },
                price: {
                    price: limitOrderResponse.price,
                    currency: this.activeMoneyBalance
                        .coin
                },
                value: {
                    amount: limitOrderResponse.amount * amount,
                    currency: this.activeMoneyBalance
                        .coin
                },
                type: limitOrderResponse.type,
                id: limitOrderResponse.id,
                datetime: limitOrderResponse.datetime,
                transaction_type: transaction_type,
                status: status
            };
        } else {
            coin_tran = {
                user: token.user._id,
                amount: {
                    amount: amount,
                    currency: this.activeMoneyBalance
                        .coin
                },
                datetime: Date.now(),
                transaction_type: transaction_type,
                status: status
            };
        }

        console.log("Coin Transaction");
        console.log(coin_tran);

        return this.coinService.saveCoinTransaction(coin_tran);
    }
    findIndexToUpdate(newItem) {
        return newItem.coin.toLowerCase() === this;
    }
    buyUpdateCoinBalance(amount: any, limitOrderResponse: any){
        let updateCoinBalance:any = this.coinBalance.balance.find(this.findIndexToUpdate, this.activeCoinBalance.coin.toLowerCase());
        let index = this.coinBalance.balance.indexOf(updateCoinBalance);
        if (index > -1) {
            updateCoinBalance.balance = updateCoinBalance.balance + limitOrderResponse.amount;
            this.coinBalance.balance[index] = updateCoinBalance;
        } else {
            let b: any = {
                coin: this.activeCoinBalance.coin.toLowerCase(),
                balance: limitOrderResponse.amount.toFixed(6)
            };
            this.coinBalance.balance.push(b);
        }
        console.log("CoinBalance");
        console.log(this.coinBalance);

        return this.coinService.saveCoinBalance(this.coinBalance);
    }

    buyMoneyTransaction(amount: any, limitOrderResponse: any, transaction_type: any,status: any){
        let token = JSON.parse(localStorage.getItem("token"));
        let money_transaction: any ={
            user : token.user._id,
            amount : {
                amount: amount,
                currency: this.activeMoneyBalance.coin
            },
            status : "success",
            transaction_type : "IOB",
            price : {
                price: limitOrderResponse.price,
                currency: this.activeMoneyBalance.coin
            },
            value : {
                amount: limitOrderResponse.amount,
                currency: this.activeCoinBalance.coin
            },
            type : limitOrderResponse.type,
            id : limitOrderResponse.id,
            datetime : limitOrderResponse.datetime
        };

        return this.moneyService.addMoneyTransaction(money_transaction);
            // .subscribe(
            //     tranSuccess => {
            //         this.moneyService.refreshMoneyTransaction();
            //     },
            //     err => {
            //         console.log(err);
            //     }
            // );
    }

    buyUpdateMoneyBalance(amount: any){
        let money_balance: any = this.moneyBalance;
        let buyBalIndex: any = money_balance.balance.findIndex(
            c =>
                c.coin.toLowerCase() ===
                this.activeMoneyBalance.coin.toLowerCase()
        );
        money_balance.balance[
            buyBalIndex
        ].balance = (
            parseFloat(
                money_balance.balance[buyBalIndex]
                    .balance
            ) - parseFloat(amount)
        ).toFixed(8);

        return this.moneyService.updateMoneyBalance(money_balance)
        // .subscribe(
        //     success => {
        //         this.moneyService.refreshMoneyTransaction();
        //         this.snakbar.open("Transaction Successfull","",{duration: 3000});
        //     },
        //     error => {
        //         this.snakbar.open("Error Something went wrong","",{duration: 3000});
        //     }
        // );
    }
    sellCoinTransaction(amount: any, limitOrderResponse: any, transaction_type: any,status: any){
        let token = JSON.parse(localStorage.getItem("token"));
        let coin_tran: any ={};
        if (limitOrderResponse) {
            coin_tran = {
                user: token.user._id,
                amount: {
                    amount: amount,
                    currency: this.activeMoneyBalance
                        .coin
                },
                price: {
                    price: limitOrderResponse.price,
                    currency: this.activeMoneyBalance
                        .coin
                },
                rate: {
                    amount: limitOrderResponse.price,
                    currency: this.activeCoinBalance
                        .coin
                },
                value: {
                    amount: limitOrderResponse.amount,
                    currency: this.activeCoinBalance
                        .coin
                },
                type: limitOrderResponse.type,
                id: limitOrderResponse.id,
                datetime: limitOrderResponse.datetime,
                transaction_type: transaction_type,
                status: status
            };
        } else {
            coin_tran = {
                user: token.user._id,
                amount: {
                    amount: amount,
                    currency: this.activeMoneyBalance
                        .coin
                },
                datetime: Date.now(),
                transaction_type: transaction_type,
                status: status
            };
        }

        console.log("Coin Transaction");
        console.log(coin_tran);

        return this.coinService.saveCoinTransaction(coin_tran);
    }

    sellUpdateCoinBalance(amount: any, limitOrderResponse: any){
        let coin_balance: any = this.coinBalance;
        let sellBalIndex: any = coin_balance.balance.findIndex(
            c =>
                c.coin.toLowerCase() ===
                this.activeCoinBalance.coin.toLowerCase()
        );
        if (sellBalIndex > -1) {
            coin_balance.balance[
                sellBalIndex
            ].balance = (
                parseFloat(
                    coin_balance.balance[
                        sellBalIndex
                    ].balance
                ) + parseFloat(limitOrderResponse.amount)
            ).toFixed(8);
        } else {
            let b: any = {
                coin: this.activeCoinBalance.coin.toLowerCase(),
                balance: limitOrderResponse.amount.toFixed(6)
            };
            coin_balance.balance.push(b);
        }
        console.log("CoinBalance");
        console.log(this.coinBalance);
        console.log(coin_balance);

        return this.coinService.saveCoinBalance(coin_balance);
    }

    sellMoneyTransaction(amount: any, limitOrderResponse: any, transaction_type: any,status: any){
        let token = JSON.parse(localStorage.getItem("token"));

        let money_transaction: any;
        if (limitOrderResponse) {
            money_transaction = limitOrderResponse;
            money_transaction.user = token.user._id;
            money_transaction.amount = {
                amount: amount,
                currency: this.activeMoneyBalance.coin
            };
            money_transaction.status = "success";
            money_transaction.transaction_type = "IOB";
            money_transaction.price = {
                price: limitOrderResponse.price,
                currency: this.activeMoneyBalance.coin
            };
            money_transaction.value = {
                amount: limitOrderResponse.amount,
                currency: this.activeCoinBalance.coin
            };
            money_transaction.type = limitOrderResponse.type;
            money_transaction.id = limitOrderResponse.id;
            money_transaction.datetime = limitOrderResponse.datetime;

        } else {
            money_transaction.user = token.user._id;
            money_transaction.amount = {
                amount: amount,
                currency: this.activeMoneyBalance.coin
            };
            money_transaction.status = status;
            money_transaction.transaction_type = transaction_type;
            money_transaction.datetime = Date.now();
        }

        return this.moneyService.addMoneyTransaction(money_transaction);
            // .subscribe(
            //     tranSuccess => {
            //         this.moneyService.refreshMoneyTransaction();
            //     },
            //     err => {
            //         console.log(err);
            //     }
            // );
    }

    sellUpdateMoneyBalance(amount: any){
        let money_balance: any = this.moneyBalance;
        let buyBalIndex: any = money_balance.balance.findIndex(
            c =>
                c.coin.toLowerCase() ===
                this.activeMoneyBalance.coin.toLowerCase()
        );
        money_balance.balance[
            buyBalIndex
        ].balance = (
            parseFloat(
                money_balance.balance[buyBalIndex]
                    .balance
            ) - parseFloat(amount)
        ).toFixed(8);

        return this.moneyService.updateMoneyBalance(money_balance)
        // .subscribe(
        //     success => {
        //         this.moneyService.refreshMoneyTransaction();
        //         this.snakbar.open("Transaction Successfull","",{duration: 3000});
        //     },
        //     error => {
        //         this.snakbar.open("Error Something went wrong","",{duration: 3000});
        //     }
        // );
    }
}
