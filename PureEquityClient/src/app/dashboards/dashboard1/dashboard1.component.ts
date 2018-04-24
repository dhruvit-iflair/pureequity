import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist/dist/chartist.component";
import { DashboardService } from '../../shared/services/dashboard.service';
import { Coins } from '../../shared/interfaces/coins.interface';
import { Trades, TradesData } from '../../shared/interfaces/trades.interface';
import { single, multi, co, charti} from './cdata';
import * as $ from 'jquery'
import * as Highcharts from 'highcharts/highstock.js';
declare var require: any;

const data: any = require('./data.json');

export interface Chart {
    type: ChartType;
    data: Chartist.IChartistData;
    options?: any;
    responsiveOptions?: any;
    events?: ChartEvent;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit, OnDestroy {
    public isPending = false;
    public tradeCoin:String = 'BTC / USD';
    public tradeList: any[] = [
        { name: 'BTC / USD', isActive: true,  value: 'btcusd' , data: []},
        { name: 'BTC / EUR', isActive: false, value: 'btceur' , data: []},
        { name: 'EUR / USD', isActive: false, value: 'eurusd' , data: []},
        { name: 'XRP / USD', isActive: false, value: 'xrpusd' , data: []},
        { name: 'XRP / EUR', isActive: false, value: 'xrpeur' , data: []},
        { name: 'XRP / BTC', isActive: false, value: 'xrpbtc' , data: []},
        { name: 'LTC / USD', isActive: false, value: 'ltcusd' , data: []},
        { name: 'LTC / EUR', isActive: false, value: 'ltceur' , data: []},
        { name: 'LTC / BTC', isActive: false, value: 'ltcbtc' , data: []},
        { name: 'ETH / USD', isActive: false, value: 'ethusd' , data: []},
        { name: 'ETH / EUR', isActive: false, value: 'etheur' , data: []},
        { name: 'ETH / BTC', isActive: false, value: 'ethbtc' , data: []},
        { name: 'BCH / USD', isActive: false, value: 'bchusd' , data: []},
        { name: 'BCH / EUR', isActive: false, value: 'bcheur' , data: []},
        { name: 'BCH / BTC', isActive: false, value: 'bchbtc' , data: []}
    ];
    constructor(public dashboardService: DashboardService) {
        if (localStorage.getItem('tradeList')) {
            this.tradeList = JSON.parse(localStorage.getItem('tradeList'));
        }
        this.dashboardService.tradeValue().subscribe((res:any) => {
                this.tradeList = res;
                localStorage.setItem('tradeList',JSON.stringify(this.tradeList));
                if (this.isPending) {
                    this.isPending = false;                
                }
        });
    }
    public int: any;
    
    onSelect(event) {
        console.log(event);
    }
    
    ngOnInit() {
        this.int = setInterval(() => {          
                this.dashboardService.trades();
        }, 500);
        $(document).ready(function () {
            Highcharts.stockChart('container', {
                rangeSelector: {
                    selected: 1
                },
                series: [{
                    name: 'USD',
                    data: charti,
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            });
        });
    }

    ngOnDestroy() {
        if (this.int) {
            clearInterval(this.int);
        }
    }
    toggleValue(i) {
        if (!this.tradeList[i].isActive) {
            this.tradeList.map(t=>{
                t.isActive = false
            });
            this.tradeList[i].isActive = !this.tradeList[i].isActive;
            this.tradeCoin = this.tradeList[i].name;
        }
    }
}
