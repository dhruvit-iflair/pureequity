import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import { environment } from "../../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { Coins } from "../interfaces/coins.interface";
import { Trades } from "../interfaces/trades.interface";

@Injectable()
export class DashboardService {
  public coins = new Subject<Coins>();
  public tra = new Subject<any>();
  public isActive = [];
  public tradeList: any[] = [
    { name: 'BTC / USD', isActive: true, value: 'btcusd', data: [] },
    { name: 'BTC / EUR', isActive: false, value: 'btceur', data: [] },
    { name: 'EUR / USD', isActive: false, value: 'eurusd', data: [] },
    { name: 'XRP / USD', isActive: false, value: 'xrpusd', data: [] },
    { name: 'XRP / EUR', isActive: false, value: 'xrpeur', data: [] },
    { name: 'XRP / BTC', isActive: false, value: 'xrpbtc', data: [] },
    { name: 'LTC / USD', isActive: false, value: 'ltcusd', data: [] },
    { name: 'LTC / EUR', isActive: false, value: 'ltceur', data: [] },
    { name: 'LTC / BTC', isActive: false, value: 'ltcbtc', data: [] },
    { name: 'ETH / USD', isActive: false, value: 'ethusd', data: [] },
    { name: 'ETH / EUR', isActive: false, value: 'etheur', data: [] },
    { name: 'ETH / BTC', isActive: false, value: 'ethbtc', data: [] },
    { name: 'BCH / USD', isActive: false, value: 'bchusd', data: [] },
    { name: 'BCH / EUR', isActive: false, value: 'bcheur', data: [] },
    { name: 'BCH / BTC', isActive: false, value: 'bchbtc', data: [] }
  ];
  constructor(public http: HttpClient, public toster: ToastrService) {
    if (localStorage.getItem('tradeList')) {
      this.tradeList = JSON.parse(localStorage.getItem('tradeList'));
      this.tradeList[this.tradeList.findIndex(t=>t.isActive==true)].isActive = false;
      this.tradeList[this.tradeList.findIndex(t=>t.name == 'BTC / USD')].isActive = true;
    }
  }
  trades() {
    for (let i = 0; i < this.tradeList.length; i++) {
      if (!this.isActive[i]) {
        this.isActive[i] = true;
        const key = this.tradeList[i];
        this.http.get(environment.tradingApi + '/trades/' + key.value).subscribe((res: any) => {
          if (res.payload && res.payload.data) {
            this.tradeList[i].data = res.payload.data;
            // localStorage.setItem('tradeList', JSON.stringify(this.tradeList));
            this.tra.next(this.tradeList);
          }
          if (this.isActive[i]) {
            this.isActive[i] = false;
          }
        }, (error) => {
          //this.toster.error('Something went wrong, please try again later', 'Error');
          console.log(error);
        })
      }
    }
  }
  tradeValue(): Observable<Trades> {
    return this.tra.asObservable();
  }
}
