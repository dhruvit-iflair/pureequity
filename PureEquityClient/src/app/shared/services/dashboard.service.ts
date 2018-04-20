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
  public tra = new Subject<Trades>();
  public tradeData: any  = {
    btcusd : Array,
    btceur : Array,
    eurusd : Array,
    xrpusd : Array,
    xrpeur : Array,
    xrpbtc : Array,
    ltcusd : Array,
    ltceur : Array,
    ltcbtc : Array,
    ethusd : Array,
    etheur : Array,
    ethbtc : Array,
    bchusd : Array,
    bcheur : Array,
    bchbtc : Array
  };
  constructor(public http:HttpClient, public toster:ToastrService) { }
  fetchCoins(){
    this.http.get(environment.tradingApi + '/coins').subscribe((res:any)=>{
      this.coins.next(res.payload.data);
    }, (error)=>{
      this.toster.error('Something went wrong, please try again later', 'Error');
      console.log(error);
    })
  }
  getCoins():Observable<Coins>{
    return this.coins.asObservable();
  }
  trades(){
    var value = ['btcusd', 'btceur', 'eurusd', 'xrpusd', 'xrpeur', 'xrpbtc', 'ltcusd', 'ltceur', 'ltcbtc', 'ethusd', 'etheur', 'ethbtc', 'bchusd', 'bcheur', 'bchbtc'];
    for (let i = 0; i < value.length; i++) {
      const key = value[i];
      this.http.get(environment.tradingApi + '/trades/'+ key).subscribe((res:any)=>{
        if (res.payload && res.payload.data) {
          this.tradeData[key] = res.payload.data;
          this.tra.next(this.tradeData);              
        }
      }, (error)=>{
        this.toster.error('Something went wrong, please try again later', 'Error');
        console.log(error);
      }) 
    }    
  }
  tradeValue():Observable<Trades>{
    return this.tra.asObservable();
  }
}
