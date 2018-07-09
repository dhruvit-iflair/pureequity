import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist/dist/chartist.component";
import { DashboardService } from '../../shared/services/dashboard.service';
import { Coins } from '../../shared/interfaces/coins.interface';
import { Trades, TradesData } from '../../shared/interfaces/trades.interface';
import { single, multi, co, charti} from './cdata';
import * as $ from 'jquery'
import * as Highcharts from 'highcharts/highstock.js';

import { from } from 'rxjs/observable/from';
import { mergeMap, groupBy, toArray } from 'rxjs/operators';

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
    public hasPermission = false;
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
    public graphData: any = {
        btcusd: [],
        btceur: [],
        eurusd: [],
        xrpusd: [],
        xrpeur: [],
        xrpbtc: [],
        ltcusd: [],
        ltceur: [],
        ltcbtc: [],
        ethusd: [],
        etheur: [],
        ethbtc: [],
        bchusd: [],
        bcheur: [],
        bchbtc: []
    };
    constructor(public dashboardService: DashboardService) {
        var token=JSON.parse(localStorage.getItem('token'));
        if(token.user.role.name=='admin'){
            this.hasPermission=true;
        }
        if (localStorage.getItem('tradeList')) {
            this.tradeList = JSON.parse(localStorage.getItem('tradeList'));
            console.log(this.tradeList.findIndex(t=>t.isActive==true));
            this.tradeList[this.tradeList.findIndex(t=>t.isActive==true)].isActive = false;
            this.tradeList[this.tradeList.findIndex(t=>t.name == 'BTC / USD')].isActive = true;
        }
        this.dashboardService.tradeValue().subscribe((res:any) => {
                this.tradeList = res;
                localStorage.setItem('tradeList',JSON.stringify(this.tradeList));
                if (this.isPending) {
                    this.isPending = false;                
                }
        });
        this.dashboardService.graphList.subscribe((grp)=>{
            const source = from(grp);
            const data = source.pipe( groupBy((d:any)=> d.coin),mergeMap(group => group.pipe(toArray())));
            
            data.subscribe((graph) => {
                graph.forEach((a:any) => {
                    var date = new Date(a.timestamp*1000);
                    this.graphData[a.coin].push([a.timestamp*1000, parseFloat(a.openPrice)]);
                })
                this.drawGraph();
            });
        })
    }
    public int: any;
    public timer={hours:'',minutes:'',seconds:'',micros:''};
    onSelect(event) {
        // console.log(event);
    }
    // Line chart
    lineChart1: Chart = {
        type: 'Line',
        data: data['LineWithArea'],
        options: {
          low: 0,
          high: 35000,    
          showArea: true,
          fullWidth: true    
        }
    }
    ngOnInit() {
        this.int = setInterval(() => {          
            this.dashboardService.trades();
            var d = new Date();
            this.timer.hours=d.getHours().toString();
            this.timer.minutes=d.getMinutes().toString();
            this.timer.seconds=d.getSeconds().toString();
            this.timer.micros=d.getMilliseconds().toString();
        }, 1000);
        this.dashboardService.graph();

    }
    drawGraph(){
        let that = this;
        $(document).ready(function () {
            Highcharts.stockChart('container', {
                rangeSelector: {
                    selected: 1
                },
                series: [{
                    name: that.tradeList[that.tradeList.findIndex(t=>t.isActive==true)].name,
                    data: that.graphData[that.tradeList[that.tradeList.findIndex(t=>t.isActive==true)].value],
                    tooltip: {
                        valueDecimals: 2
                    }
                }],
                navigator: { enabled: false }
            });
            var cont = document.getElementById('container').style.height;
            var card = document.getElementById('chart-card-content').style.height
            card = cont;
            $('.highcharts-range-selector-buttons').find('text').first().remove();
            (<any>$('.spark-count')).sparkline([4, 5, 0, 10, 9, 12, 4, 9, 4, 5, 3, 10, 9, 12, 10, 9, 12, 4, 9], {
                type: 'bar'
                , width: '100%'
                , height: '70'
                , barWidth: '2'
                , resize: true
                , barSpacing: '6'
                , barColor: 'rgba(255, 255, 255, 0.3)'
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
