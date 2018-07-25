import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import { environment } from "../../../../environments/environment";
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
import { Coins } from "../interfaces/coins.interface";
import { Trades } from "../interfaces/trades.interface";

@Injectable()
export class DashboardService {
  public coins = new Subject<Coins>();
  public tra = new Subject<any>();
  public graphData = new Subject<any>();
  public graphList = this.graphData.asObservable();
  public isActive = [];
  // public graphData: any = {
  //   btcusd: [],
  //   btceur: [],
  //   eurusd: [],
  //   xrpusd: [],
  //   xrpeur: [],
  //   xrpbtc: [],
  //   ltcusd: [],
  //   ltceur: [],
  //   ltcbtc: [],
  //   ethusd: [],
  //   etheur: [],
  //   ethbtc: [],
  //   bchusd: [],
  //   bcheur: [],
  //   bchbtc: []
  // };

  public tradeList: any[] = [
    { name: 'BTC / USD', isActive: true,  value: 'btcusd', data: [] ,graph:[] },
    { name: 'BTC / EUR', isActive: false, value: 'btceur', data: [] ,graph:[] },
    { name: 'EUR / USD', isActive: false, value: 'eurusd', data: [] ,graph:[] },
    { name: 'XRP / USD', isActive: false, value: 'xrpusd', data: [] ,graph:[] },
    { name: 'XRP / EUR', isActive: false, value: 'xrpeur', data: [] ,graph:[] },
    { name: 'XRP / BTC', isActive: false, value: 'xrpbtc', data: [] ,graph:[] },
    { name: 'LTC / USD', isActive: false, value: 'ltcusd', data: [] ,graph:[] },
    { name: 'LTC / EUR', isActive: false, value: 'ltceur', data: [] ,graph:[] },
    { name: 'LTC / BTC', isActive: false, value: 'ltcbtc', data: [] ,graph:[] },
    { name: 'ETH / USD', isActive: false, value: 'ethusd', data: [] ,graph:[] },
    { name: 'ETH / EUR', isActive: false, value: 'etheur', data: [] ,graph:[] },
    { name: 'ETH / BTC', isActive: false, value: 'ethbtc', data: [] ,graph:[] },
    { name: 'BCH / USD', isActive: false, value: 'bchusd', data: [] ,graph:[] },
    { name: 'BCH / EUR', isActive: false, value: 'bcheur', data: [] ,graph:[] },
    { name: 'BCH / BTC', isActive: false, value: 'bchbtc', data: [] ,graph:[] }
  ];
  constructor(public http: HttpClient, public toster: ToastrService) {
    if (localStorage.getItem('tradeList')) {
      this.tradeList = JSON.parse(localStorage.getItem('tradeList'));
      this.tradeList[this.tradeList.findIndex(t => t.isActive == true)].isActive = false;
      this.tradeList[this.tradeList.findIndex(t => t.name == 'BTC / USD')].isActive = true;
    }
    this.graph();
  }
  trades() {
    // for (let i = 0; i < this.tradeList.length; i++) {
    //   if (!this.isActive[i]) {
    //     this.isActive[i] = true;
    //     const key = this.tradeList[i];
    //     this.http.get(environment.tradingApi + '/trades/' + key.value).subscribe((res: any) => {
    //       if (res.payload && res.payload.data) {
    //         this.tradeList[i].data = res.payload.data;
    //         // localStorage.setItem('tradeList', JSON.stringify(this.tradeList));
    //         this.tra.next(this.tradeList);
    //       }
    //       if (this.isActive[i]) {
    //         this.isActive[i] = false;
    //       }
    //     }, (error) => {
    //       //this.toster.error('Something went wrong, please try again later', 'Error');
    //       console.log(error);
    //     })
    //   }
    // }
  }
  tradeValue(): Observable<Trades> {
    return this.tra.asObservable();
  };
  lineGraph(liner){
    return this.http.get(environment.tradingApi+'/getgraphdata/'+liner);
  }
  graph() {
    this.http.get(environment.api + '/graph').subscribe((res: any) => {
      // const source = from(res);
      // const data = source.pipe( groupBy(d => d.coin),mergeMap(group => group.pipe(toArray())));
     
      // data.subscribe((graph) => {
      //   graph.forEach((a:any) => {
      //       this.graphData[a.coin].push([a.timestamp, a.openPrice]);
      //   })
      // });
      this.graphData.next(res);
    }, (error) => {
      console.log(error);
    })
  }
  // graphList(key){
  //   return this.graphData[key]?this.graphData[key] : false;
  // }
}