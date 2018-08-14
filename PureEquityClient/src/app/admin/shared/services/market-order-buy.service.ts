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
export class MarketOrderBuyService {
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

    public buyCalcSubject = new Subject<any>();

    constructor(
        public snakbar: MatSnackBar,
        private http: HttpClient,
        public tradeService: TradeService,
        public coinService: CoinsService,
        public moneyService: MoneyService
    ) {
        // this.activeTrade = {
        //     name: "BTC / USD",
        //     isActive: true,
        //     value: "btcusd",
        //     data: []
        // };
        this.activeTrade = this.tradeService.getCurrentActiveTrade()
        this.ngOnInit();
    }

    ngOnInit() {
        if (!this.activeTradeSub) {
            this.activeTradeSub = this.tradeService
                .getActiveTrade()
                .subscribe(activeTrade => {
                    this.activeTrade = activeTrade;
                    this.setCoinBalance();
                    this.setMoneyBalance();
                });
        }
        this.coinService.getCoinBalance().subscribe(bal => {
            this.coinBalance = bal;
            this.setCoinBalance();
        });
        // this.coinService.refreshCoinBalance();

        this.moneyService.getMoneyBalance().subscribe(bal => {
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

    getBuyCalculationResult(): Observable<any> {
        return this.buyCalcSubject.asObservable();
    }

    calcBuy(amount: any) {
        if (amount > 0) {
            this.buyCalcRequest ? this.buyCalcRequest.unsubscribe() : null;
            this.buyCalcRequest = this.http
                .get(
                    environment.tradingApi + "/coins/" + this.activeTrade.value
                )
                .subscribe((data: any) => {
                    let payload = data;
                    let subtotal = amount - (amount * this.fees) / 100;
                    let approx = subtotal * payload.payload.data.ask;
                    let actual = amount * payload.payload.data.ask;
                    var newCac = {
                        buySubtotal: subtotal.toFixed(8),
                        buyReceive: approx.toFixed(8),
                        buyActual:actual.toFixed(8)
                    };
                    this.buyCalcSubject.next(newCac);
                });
        }
    }

    buy(amount: any,buyActual:any, tr_type:any, ht_type:any) {
        if (amount > 0) {
            let token = JSON.parse(localStorage.getItem("token"));

            console.log(this.activeMoneyBalance);
            console.log(this.activeCoinBalance);

            this.http
                .get(
                    environment.tradingApi + "/coins/" + this.activeTrade.value
                )
                .subscribe(
                    (data: any) => {
                        let payload = {
                            amount: buyActual,
                            // price: data.payload.data.ask
                        };
                        console.log("BitStampPayload");
                        console.log(payload);

                        this.http
                            .post(
                                environment.tradingApi +
                                    `/${ht_type}/` +
                                    this.activeTrade.value,
                                payload
                            )
                            .subscribe(
                                (instantBuySuccess: any) => {
                                    console.log("InstOerderBuyRes");
                                    let instant = instantBuySuccess.payload.data;
                                    // let instant:any = {
                                    //     amount:0.00098624,
                                    //     datetime:"2018-08-07 10:56:55.045497",
                                    //     id:"1960123957",
                                    //     price:7042.29,
                                    //     type:"0"
                                    // }
                                    console.log(instant);

                                    let coin_tran: any = {
                                        user: token.user._id,
                                        amount: {
                                            amount: amount,
                                            currency: this.activeCoinBalance
                                            .coin
                                        },
                                        price: {
                                            price: instant.price,
                                            currency: this.activeMoneyBalance
                                                .coin
                                        },
                                        rate: {
                                            amount: instant.price,
                                            currency: this.activeMoneyBalance
                                                .coin
                                        },
                                        value: {
                                            amount: instant.amount * instant.price,
                                            currency: this.activeMoneyBalance
                                                .coin
                                        },
                                        type: instant.type,
                                        id: instant.id,
                                        datetime: instant.datetime,
                                        transaction_type: tr_type,
                                        status: "success"
                                    };

                                    console.log("Coin Transaction");
                                    console.log(coin_tran);

                                    this.coinService.addCoinTransaction(
                                        coin_tran
                                    );
                                    let updateCoinBalance:any = this.coinBalance.balance.find(this.findIndexToUpdate, this.activeCoinBalance.coin.toLowerCase());
                                    let index = this.coinBalance.balance.indexOf(updateCoinBalance);
                                    if (index > -1) {
                                        updateCoinBalance.balance = updateCoinBalance.balance + instant.amount;
                                        this.coinBalance.balance[index] = updateCoinBalance;
                                    } else {
                                        let b: any = {
                                            coin: this.activeCoinBalance.coin.toLowerCase(),
                                            balance: instant.amount.toFixed(6)
                                        };
                                        this.coinBalance.balance.push(b);
                                    }
                                    console.log(this.coinBalance);

                                    this.coinService.updateCoinBalance(this.coinBalance);

                                    let updateMoneyBalance:any = this.moneyBalance.balance.find(this.findIndexToUpdate, this.activeMoneyBalance.coin.toLowerCase());
                                    let indexMB = this.moneyBalance.balance.indexOf(updateMoneyBalance);
                                        updateMoneyBalance.balance = updateMoneyBalance.balance - amount;
                                        this.moneyBalance.balance[indexMB] = updateMoneyBalance;
                                    console.log(this.moneyBalance);


                                    let money_transaction: any ={
                                        user : token.user._id,
                                        amount : {
                                            amount: amount,
                                            currency: this.activeCoinBalance.coin
                                        },
                                        status : "success",
                                        transaction_type : tr_type,
                                        price : {
                                            price: instant.price,
                                            currency: this.activeMoneyBalance.coin
                                        },
                                        value : {
                                            amount: instant.amount * instant.price,
                                            currency: this.activeMoneyBalance.coin
                                        },
                                        type : instant.type,
                                        id : instant.id,
                                        datetime : instant.datetime
                                    };

                                    console.log("Money Transaction");
                                    console.log(money_transaction);
                                    console.log("Money Balance");
                                    console.log(this.moneyBalance);

                                    this.moneyService
                                        .addMoneyTransaction(money_transaction)
                                        .subscribe(
                                            tranSuccess => {
                                                this.moneyService
                                                    .updateMoneyBalance(this.moneyBalance)
                                                    .subscribe(
                                                        success => {
                                                            this.moneyService.refreshMoneyTransaction();
                                                            this.snakbar.open(
                                                                "Transaction Successfull",
                                                                "",
                                                                {
                                                                    duration: 3000
                                                                }
                                                            );
                                                            this.buyCalcSubject.next();
                                                        },
                                                        error => {
                                                            this.snakbar.open(
                                                                "Error Something went wrong",
                                                                "",
                                                                {
                                                                    duration: 3000
                                                                }
                                                            );
                                                        }
                                                    );
                                            },
                                            error => {
                                                this.snakbar.open(
                                                    "Error Something went wrong",
                                                    "",
                                                    { duration: 3000 }
                                                );
                                            }
                                        );
                                },
                                er => {
                                    this.snakbar.open(
                                        er.error.message,
                                        "",
                                        { duration: 5000 }
                                    );
                                    console.log(er);
                                    let coin_tran: any = {
                                        user: token.user._id,
                                        amount: {
                                            amount: amount,
                                            currency: this.activeMoneyBalance
                                                .coin
                                        },
                                        datetime: Date.now(),
                                        transaction_type: tr_type,
                                        status: "error"
                                    };

                                    this.coinService.addCoinTransaction(
                                        coin_tran
                                    );

                                    let money_transaction: any = data;

                                    money_transaction.user = token.user._id;
                                    money_transaction.amount = {
                                        amount: amount,
                                        currency: this.activeMoneyBalance.coin
                                    };
                                    money_transaction.status = "error";
                                    money_transaction.transaction_type = tr_type;
                                    money_transaction.datetime = Date.now();

                                    this.moneyService
                                        .addMoneyTransaction(money_transaction)
                                        .subscribe(
                                            tranSuccess => {
                                                this.moneyService.refreshMoneyTransaction();
                                            },
                                            err => {
                                                console.log(err);
                                            }
                                        );
                                }
                            );
                    },
                    err => {
                        console.log(err);
                        this.snakbar.open("Error Something went wrong", "", {
                            duration: 5000
                        });
                        let coin_tran: any = {
                            user: token.user._id,
                            amount: {
                                amount: amount,
                                currency: this.activeMoneyBalance.coin
                            },
                            datetime: Date.now(),
                            transaction_type: tr_type,
                            status: "error"
                        };

                        this.coinService.addCoinTransaction(coin_tran);

                        let money_transaction: any;

                        money_transaction.user = token.user._id;
                        money_transaction.amount = {
                            amount: amount,
                            currency: this.activeMoneyBalance.coin
                        };
                        money_transaction.status = "error";
                        money_transaction.transaction_type = tr_type;
                        money_transaction.datetime = Date.now();

                        this.moneyService
                            .addMoneyTransaction(money_transaction)
                            .subscribe(
                                tranSuccess => {
                                    this.moneyService.refreshMoneyTransaction();
                                },
                                err => {
                                    console.log(err);
                                }
                            );
                    }
                );
        }
        // else {

        // }
    }
    findIndexToUpdate(newItem) {
        return newItem.coin.toLowerCase() === this;
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
        console.log(this.activeCoinBalance,this.activeMoneyBalance);
        console.log(cb_1,cb_2);
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
        console.log(this.activeCoinBalance,this.activeMoneyBalance);
        console.log(mb_1,mb_2);
    }
}


export interface instantOrderBuy {
    price: Number;
    amount: Number;
    type: Number;
    id: String;
    datetime: Date;
}
