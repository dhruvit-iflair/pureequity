import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TradeService, TradeRecord } from './trade.service';
import { Subject } from 'rxjs/Subject';
import { CoinBalance, Balance } from '../../dashboards/buysell/buysell.component';
import { MatSnackBar } from '@angular/material';
import { CoinsService } from './coins.service';
import { MoneyService } from './money.service';

@Injectable()
export class MarketOrderSellService {

    public sellCalcRequest: any;
    public fees: any = 0.25;
    public activeTradeSub: any;
    public activeTrade: TradeRecord;

    public sellCalcSubject = new Subject<any>();


    public coinBalance: CoinBalance;
    public moneyBalance: CoinBalance;
    public activeCoinBalance: Balance;
    public activeMoneyBalance: Balance;

    public coinBSub: any;
    public moneyBSub: any;

    constructor(
        public snakbar: MatSnackBar,
        private http: HttpClient,
        public tradeService: TradeService,
        public coinService: CoinsService,
        public moneyService: MoneyService
    ) {
        // this.activeTrade = { name: "BTC / USD", isActive: true, value: "btcusd", data: [] };
        this.activeTrade = this.tradeService.getCurrentActiveTrade();
        this.ngOnInit();
    }

    ngOnInit() {
        if (!this.activeTradeSub) {
            this.activeTradeSub = this.tradeService.getActiveTrade().subscribe(activeTrade => {
                this.activeTrade = activeTrade;
                console.log(activeTrade);
                this.setCoinBalance();
                this.setMoneyBalance();
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

    getSellCalculationResult(): Observable<any> {
        return this.sellCalcSubject.asObservable();
    }

    calcSell(amount: any) {
        if (amount > 0) {
            (this.sellCalcRequest) ? this.sellCalcRequest.unsubscribe() : null;
            this.sellCalcRequest = this.http
                .get(environment.tradingApi + "/coins/" + this.activeTrade.value)
                .subscribe((data: any) => {
                    let payload = data;
                    let subtotal = amount * payload.payload.data.bid;
                    let approx = subtotal - ((subtotal * parseFloat(this.fees)) / 100);
                    let actual = amount

                    var newCac = {
                        sellSubtotal: subtotal.toFixed(8),
                        sellReceive: approx.toFixed(8),
                        sellActual: actual.toFixed(8)
                    };
                    this.sellCalcSubject.next(newCac);
                });
        }
    }
    setCoinBalance() {
        let cb_1 = this.coinBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(0, 3).toLowerCase());
        let cb_2 = this.coinBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(3, 6).toLowerCase());
        (cb_1 && !cb_2) ? this.activeCoinBalance = cb_1 : null;
        (!cb_1 && cb_2) ? this.activeMoneyBalance = cb_2 : null;
        if (cb_1 && cb_2) { this.activeMoneyBalance = cb_2; this.activeCoinBalance = cb_1 };
    }

    setMoneyBalance() {
        let mb_1 = this.moneyBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(3, 6).toLowerCase());
        let mb_2 = this.moneyBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(0, 3).toLowerCase());
        (mb_1 && !mb_2) ? this.activeMoneyBalance = mb_1 : null;
        (mb_2 && !mb_1) ? this.activeCoinBalance = mb_2 : null;
        if (mb_1 && mb_2) { this.activeMoneyBalance = mb_1; this.activeCoinBalance = mb_2 };
    }
    /**
     *
     *
     * @param {*} amount
     * @param {*} receive
     * @param {*} sellActual
     * @returns
     * @memberof InstantOrderSellService
     */
    sell(amount: any, sellActual: any ,tr_type: any, ht_type:any) {
        if (amount > 0) {
            let token = JSON.parse(localStorage.getItem("token"));

            console.log(this.activeMoneyBalance);
            console.log(this.activeCoinBalance);

            let payload = {
                amount: sellActual
            };
            this.callHttp(payload,ht_type).subscribe((sellInstant: any) => {
                this.coinTransaction(amount,sellInstant.payload.data,tr_type,'success').subscribe((cTSuccess: any) => {
                    console.log("cTSuccess",cTSuccess);
                    this.coinService.refreshCoinTransaction();
                },(er:any)=>{
                    console.log(er);
                });
                this.moneyTransaction(amount,sellInstant.payload.data,tr_type,'success').subscribe((mTSuccess: any) => {
                    console.log("mTSuccess",mTSuccess);
                    this.moneyService.refreshMoneyTransaction();
                    this.snakbar.open("Transaction Successfull","",{duration: 3000});
                    this.sellCalcSubject.next();
                },(er:any)=>{
                    console.log(er);
                });
                this.updateMoneyBalance(amount,sellInstant.payload.data).subscribe((mBSuccess:any)=>{
                    console.log("mBSuccess",mBSuccess);
                    this.coinService.refreshCoinBalance();
                },(er:any)=>{
                    console.log(er);
                });
                this.updateCoinBalance(amount,sellInstant.payload.data).subscribe((cb:any)=>{
                    console.log("cb",cb);
                    this.moneyService.refreshMoneyBalance();
                },(er:any)=>{
                    console.log(er);
                });
            }, (error: any) => {
                console.log(error);
                this.snakbar.open(error.error.message,"",{duration: 3000});
            });
        }
    };

    callHttp(payload: any, ht_type:any) {
        return this.http.post(environment.tradingApi + `/${ht_type}/` + this.activeTrade.value, payload)
    }

    coinTransaction(amount: any, sellInstant: any, transaction_type: any, status: any) {
        let token = JSON.parse(localStorage.getItem("token"));
        let coin_tran: any = {};
        if (sellInstant) {
            coin_tran = {
                user: token.user._id,
                amount: {
                    amount: amount,
                    currency: this.activeCoinBalance
                        .coin
                },
                price: {
                    price: sellInstant.price,
                    currency: this.activeMoneyBalance
                        .coin
                },
                rate: {
                    amount: sellInstant.price,
                    currency: this.activeMoneyBalance
                        .coin
                },
                value: {
                    amount: sellInstant.amount *  sellInstant.price,
                    currency: this.activeMoneyBalance
                        .coin
                },
                type: sellInstant.type,
                id: sellInstant.id,
                datetime: sellInstant.datetime,
                transaction_type: transaction_type,
                status: status
            };
        } else {
            coin_tran = {
                user: token.user._id,
                amount: {
                    amount: amount,
                    currency: this.activeMoneyBalance.coin
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

    updateCoinBalance(amount: any, sellInstant: any) {
        let coin_balance: any = this.coinBalance;
        let sellBalIndex: any = coin_balance.balance.findIndex(
            c =>
                c.coin.toLowerCase() ===
                this.activeCoinBalance.coin.toLowerCase()
        );
            coin_balance.balance[
                sellBalIndex
            ].balance = (
                parseFloat(
                    coin_balance.balance[
                        sellBalIndex
                    ].balance
                ) - parseFloat(sellInstant.amount)
            ).toFixed(8);
        console.log("CoinBalance");
        console.log(this.coinBalance);
        console.log(coin_balance);

        return this.coinService.saveCoinBalance(coin_balance);
    }

    moneyTransaction(amount: any, sellInstant: any, transaction_type: any, status: any) {
        let token = JSON.parse(localStorage.getItem("token"));

        var money_transaction;
        if (sellInstant) {
            money_transaction = {
                user : token.user._id,
                amount : {
                    amount: amount,
                    currency: this.activeCoinBalance.coin
                },
                status : "success",
                transaction_type : "MOS",
                price : {
                    price: sellInstant.price,
                    currency: this.activeMoneyBalance.coin
                },
                value : {
                    amount: sellInstant.amount * sellInstant.price,
                    currency: this.activeMoneyBalance.coin
                },
                type : sellInstant.type,
                id : sellInstant.id,
                datetime : sellInstant.datetime,
            };
        }
        else {
            money_transaction = {
                user : token.user._id,
                amount : {
                    amount: amount,
                    currency: this.activeMoneyBalance.coin
                },
                status : status,
                transaction_type : transaction_type,
                datetime : Date.now()
            };
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

    findIndexToUpdate(newItem) {
        return newItem.coin.toLowerCase() === this;
    }
    updateMoneyBalance(amount: any, sellInstant:any) {

        let updateMoneyBalance:any = this.moneyBalance.balance.find(this.findIndexToUpdate, this.activeMoneyBalance.coin.toLowerCase());
        let indexMB = this.moneyBalance.balance.indexOf(updateMoneyBalance);
        updateMoneyBalance.balance = updateMoneyBalance.balance + (sellInstant.amount * sellInstant.price);
        this.moneyBalance.balance[indexMB] = updateMoneyBalance;
        console.log(this.moneyBalance);
        return this.moneyService.updateMoneyBalance(this.moneyBalance)
    }
}
