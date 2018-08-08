import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AbstractControl, ValidatorFn } from '@angular/forms';
@Injectable()
export class TradeService {
    public tradeList: Array<TradeRecord> = [
        { name: "BTC / USD", isActive: true,  value: "btcusd", data: [], minBuy:6,minSell:0.001 },
        { name: "BTC / EUR", isActive: false, value: "btceur", data: [], minBuy:6,minSell:0.001 },
        // { name: "EUR / USD", isActive: false, value: "eurusd", data: [], minBuy:6,minSell:5 },
        { name: "XRP / USD", isActive: false, value: "xrpusd", data: [], minBuy:6,minSell:13 },
        { name: "XRP / EUR", isActive: false, value: "xrpeur", data: [], minBuy:6,minSell:13 },
        { name: "XRP / BTC", isActive: false, value: "xrpbtc", data: [], minBuy:0.001,minSell:13 },
        { name: "LTC / USD", isActive: false, value: "ltcusd", data: [], minBuy:6,minSell:0.07 },
        { name: "LTC / EUR", isActive: false, value: "ltceur", data: [], minBuy:6,minSell:0.07 },
        { name: "LTC / BTC", isActive: false, value: "ltcbtc", data: [], minBuy:0.001,minSell:0.07 },
        { name: "ETH / USD", isActive: false, value: "ethusd", data: [], minBuy:6,minSell: 0.02 },
        { name: "ETH / EUR", isActive: false, value: "etheur", data: [], minBuy:6,minSell: 0.02 },
        { name: "ETH / BTC", isActive: false, value: "ethbtc", data: [], minBuy:0.001,minSell: 0.02 },
        { name: "BCH / USD", isActive: false, value: "bchusd", data: [], minBuy:6,minSell:0.008 },
        { name: "BCH / EUR", isActive: false, value: "bcheur", data: [], minBuy:6,minSell:0.008 },
        { name: "BCH / BTC", isActive: false, value: "bchbtc", data: [], minBuy:0.001,minSell:0.008 }
    ];
    public tradeListSubject = new Subject<Array<TradeRecord>>();
    public activeTradeSubject = new Subject<TradeRecord>();
    public sellCalcSubject = new Subject<any>();

    public activeTrade : TradeRecord;
    public fees : any = 0.25;


    constructor(
        public http :HttpClient
    ) {
        // initialize first all trade to BTC USD
        this.tradeListSubject.next(this.tradeList);
        this.activeTrade = { name: "BTC / USD", isActive: true, value: "btcusd", data: [],minBuy:6,minSell:0.001 };
        this.activeTradeSubject.next(this.activeTrade);
    }

    getTradeList():Observable<Array<TradeRecord>>{
        return this.tradeListSubject.asObservable()
    }
    getTradeData(){
        return this.tradeList;
    }

    getSellCalculationResult():Observable <any>{
        return this.sellCalcSubject.asObservable();
    }
    toggleTradeChip(i) {
        if (!this.tradeList[i].isActive) {
            this.tradeList.map(t => {
                t.isActive = false;
            });
            this.tradeList[i].isActive = true;
            this.tradeListSubject.next(this.tradeList);
            this.activeTrade = this.tradeList[i];
            this.activeTradeSubject.next(this.tradeList[i]);
        }
    }

    getActiveTrade():Observable<TradeRecord>{
        // return this.tradeList.find(t=>t.isActive ===true);
        return this.activeTradeSubject.asObservable();
    }
}

export interface TradeRecord{
    name: String,
    isActive: Boolean,
    value: String,
    data: Array<any>,
    minBuy?:number,
    minSell? : number
}


export function ValidateUrl(control: AbstractControl) {
    if (!control.value.startsWith('https') || !control.value.includes('.io')) {
      return { validUrl: true };
    }
    return null;
}
