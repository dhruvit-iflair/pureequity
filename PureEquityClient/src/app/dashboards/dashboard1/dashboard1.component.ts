import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist/dist/chartist.component";
import { DashboardService } from '../../shared/services/dashboard.service';
import { Coins } from '../../shared/interfaces/coins.interface';
import { Trades } from '../../shared/interfaces/trades.interface';
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
export class Dashboard1Component implements AfterViewInit, OnInit, OnDestroy {
    single: any[];
    multi: any[];
  
    view: any[] = [600, 350];
  
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'Population';
  
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    graphFilter = [
        {
            name: 'All',
            value : 'all'
        },
        {
            name: '1 year',
            value : 'year'
        },
        {
            name: '1 month',
            value : 'month'
        },
        {
            name: '1 week',
            value : 'week'
        }
    ]
    // line, area
    autoScale = true;
    isPending = false;
    public tradeCoin:String = 'BTC / USD';
    public trade: any  = {
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
    public coins = co;
    public graphData = multi;
    constructor(private cdr: ChangeDetectorRef, public dashboardService: DashboardService) {

        this.dashboardService.getCoins().subscribe((res:any) => {
            if (this.coins.length > 9) {
                this.coins.splice(0,1);
                this.coins.push(res);
            } else {
                this.coins.push(res);                
            }
            if (this.isPending) {
                this.isPending = false;
            }
        });
        this.dashboardService.tradeValue().subscribe((res:Trades) => {
            for(var key in res){
                // if (res[key] && this.trade[key] ) {
                    this.trade[key] = res[key];      
                // } 
            }
        });
        Object.assign(this, {single, multi});
    }
    public int: any;
    
    onSelect(event) {
        console.log(event);
    }
    
    ngOnInit() {
        this.int = setInterval(() => {
            if (!this.isPending) {
                this.isPending = true;                
                this.dashboardService.fetchCoins();
                this.dashboardService.trades();
            }
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
    // Barchart
    barChart1: Chart = {
        type: 'Bar',
        data: data['Bar'],
        options: {
            seriesBarDistance: 15,
            high: 12,
            axisX: {
                showGrid: false, offset: 20
            },
            axisY: {
                showGrid: true, offset: 40
            }
        },
        responsiveOptions: [
            [
                'screen and (min-width: 640px)',
                {
                    axisX: {
                        labelInterpolationFnc: function (value: number, index: number): string {
                            return index % 1 === 0 ? `${value}` : null;
                        }
                    }
                }
            ]
        ]
    };

    // This is for the donute chart
    donuteChart1: Chart = {
        type: 'Pie',
        data: data['Pie'],
        options: {
            donut: true,
            showLabel: false,
            donutWidth: 30

        }
        // events: {
        //   draw(data: any): boolean {
        //     return data;
        //   }
        // }
    };
    // This is for the line chart
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
    };
    ngAfterViewInit() {
    }
    // Timeline 
    mytimelines: any[] = [{
        from: 'Nirav joshi',
        time: '(5 minute ago)',
        image: 'assets/images/users/1.jpg',
        attachment: 'assets/images/big/img2.jpg',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper'
    }, {
        from: 'Sunil joshi',
        time: '(3 minute ago)',
        image: 'assets/images/users/2.jpg',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
        buttons: 'primary'
    }, {
        from: 'Vishal Bhatt',
        time: '(1 minute ago)',
        image: 'assets/images/users/3.jpg',
        attachment: 'assets/images/big/img1.jpg',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper'
    }, {
        from: 'Dhiren Adesara',
        time: '(1 minute ago)',
        image: 'assets/images/users/4.jpg',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper',
        buttons: 'warn'
    }];
    public tradeList: any[] = [
        { name: 'BTC / USD', isActive: true, value: 'btcusd' },
        { name: 'BTC / EUR', isActive: false, value: 'btceur' },
        { name: 'EUR / USD', isActive: false, value: 'eurusd' },
        { name: 'XRP / USD', isActive: false, value: 'xrpusd' },
        { name: 'XRP / EUR', isActive: false, value: 'xrpeur' },
        { name: 'XRP / BTC', isActive: false, value: 'xrpbtc' },
        { name: 'LTC / USD', isActive: false, value: 'ltcusd' },
        { name: 'LTC / EUR', isActive: false, value: 'ltceur' },
        { name: 'LTC / BTC', isActive: false, value: 'ltcbtc' },
        { name: 'ETH / USD', isActive: false, value: 'ethusd' },
        { name: 'ETH / EUR', isActive: false, value: 'etheur' },
        { name: 'ETH / BTC', isActive: false, value: 'ethbtc' },
        { name: 'BCH / USD', isActive: false, value: 'bchusd' },
        { name: 'BCH / EUR', isActive: false, value: 'bcheur' },
        { name: 'BCH / BTC', isActive: false, value: 'bchbtc' }
    ];
    toggleValue(i) {
        if (!this.tradeList[i].isActive) {
            this.tradeList.map(t=>{
                t.isActive = false
            });
            this.tradeList[i].isActive = !this.tradeList[i].isActive;
            this.tradeCoin = this.tradeList[i].name;
        }
    }
    toggleChartValue(c){
        var that = this;
        switch (c.value) {
            case "all":
              confirm("All");
              break;
            case "week":
              confirm("week");
              break;
            case "month":
              confirm("Indigo is the color of intuition.");
              break;
            case "year":
              confirm("Purple is the color of the imagination.");
              break;
            default:
              confirm("Sorry, that color is not in the system yet!");
          }
    }
}
