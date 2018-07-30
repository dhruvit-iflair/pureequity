import { Component, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist/dist/chartist.component";
import { DashboardService } from '../../shared/services/dashboard.service';
import { Coins } from '../../shared/interfaces/coins.interface';
import { Trades, TradesData } from '../../shared/interfaces/trades.interface';
import { single, multi, co, charti } from './cdata';
// import * as $ from 'jquery'
import * as Highcharts from 'highcharts/highstock.js';
import * as shape from 'd3-shape';
import * as d3 from 'd3';
// import { single, multi, generateData } from './chartData';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
//for table data showing
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
//for table data showing
declare var require: any;
declare var $: any;
// declare var CanvasJS: any;
declare var Pusher: any;
var pusherz = new Pusher('de504dc5763aeef9ff52');
const data: any = require('./data.json');

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss']
})
export class Dashboard1Component implements OnInit, OnDestroy {
    //for table data showing
    displayedColumns = ['amount', 'price', 'timestamp']
    dataSource: MatTableDataSource<any>;
    public i: Number = 0; x = false; janvar = [];
    public page: { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    //for table data showing
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    lineChart1 = {
        type: 'Line',
        data: data['LineWithArea'],
        options: {
            low: 0,
            showArea: true,
            fullWidth: true
        }
    };
    public isPending = false;
    public hasPermission = false;
    public tradeCoin: String = 'BTC / USD';
    public selectedValue: any = 'btcusd';
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
    //ngx

    dateData = { name: 'test', series: [{ name: '1111', value: 10 }, { name: '4444', value: 40 }, { name: '2222', value: 20 }] };
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = true;
    tooltipDisabled = false;
    xAxisLabel = 'Country';
    showYAxisLabel = true;
    yAxisLabel = 'GDP Per Capita';
    showGridLines = true;
    innerPadding = 0;
    autoScale = true;
    timeline = false;
    barPadding = 8;
    groupPadding = 0;
    roundDomains = false;
    maxRadius = 10;
    minRadius = 3;
    view = '';
    showLabels = true;
    explodeSlices = false;
    doughnut = false;
    arcWidth = 0.25;
    rangeFillOpacity = 0.15;

    colorScheme = {
        domain: [
            '#1e88e5', '#2ECC71', '#26c6da', '#ffc65d', '#d96557', '#ba68c8'
        ]
    };
    schemeType = 'ordinal';
    //ngx


    //chartjs
    // lineChart
    public lineChartData: Array<any> = [
        { data: [], label: '' }
    ];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(25,118,210,0.1)',
            borderColor: 'rgba(25,118,210,1)',
            pointBackgroundColor: 'rgba(25,118,210,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(25,118,210,0.5)'
        },
        {
            // dark grey
            backgroundColor: 'rgba(38,218,210,0.1)',
            borderColor: 'rgba(38,218,210,1)',
            pointBackgroundColor: 'rgba(38,218,210,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(38,218,210,0.5)'
        }

    ];
    public lineChartLegend: boolean = false;
    public lineChartType: string = 'line';

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }
    //chartjs
    constructor(public dashboardService: DashboardService) {

        var token = JSON.parse(localStorage.getItem('token'));
        if (token.user.role.name == 'admin') {
            this.hasPermission = true;
        }
        this.dashboardService.lineGraph('btcusd').subscribe((ed) => {
            this.lineChart1.data = ed['btcusd'];
            this.lineChart1.options = {
                low: 0,
                showArea: true,
                fullWidth: true
            }
            for (var x = 0; x < ed['btcusd'].labels.length; x++) {
                this.lineChartData[0].data.push(ed['btcusd'].series[0][x]);
                this.lineChartLabels.push(ed['btcusd'].labels[x]);
                // this.dateData.series.push({name:this.lineChart1.data.labels[x],value:this.lineChart1.data.series[0][x]});
            }
        });
        this.dataSource = new MatTableDataSource(this.janvar);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    public int: any;
    public my_channel; preVal;
    public timer = { hours: '12', minutes: '123', seconds: '85', micros: '785' };
    onSelect(event) {
        // console.log(event);
    }
    //for table data showing
    pageEvent(event) {
        event = this.page;
        this.i = event.pageIndex * event.pageSize;
    }
    dataconverter() {
        //   this.lineChartData[0].data
    }
    //for table data showing
    ngOnInit() {
        this.valSetter();
        this.scrollEvent();
        // this.lekachukole();
    }

    valSetter() {
        var those = this;
        if (this.selectedValue == "btcusd") {
            this.my_channel = pusherz.subscribe('live_trades');
        }
        else {
            this.my_channel = pusherz.subscribe('live_trades_' + those.selectedValue);
        }
        this.my_channel.bind('trade', function (data) {
            console.log(data);
            console.log(data.price + '----' + data.timestamp);
            those.lineChart1.data.series[0].push(data.price_str);
            var FDt = new Date(data.timestamp * 1000);
            var xdt = FDt.getDate() + '-' + (FDt.getMonth() + 1) + '-' + FDt.getFullYear().toString().substr(-2) + '-' + FDt.getHours() + ':' + FDt.getMinutes() + ':' + FDt.getSeconds();
            
            //for table data showing
            those.janvar.push({ amount: data.amount, price: data.price_str, timestamp: xdt });
            those.dataSource = new MatTableDataSource(those.janvar);
            those.dataSource.paginator = those.paginator;
            those.dataSource.sort = those.sort;
            //for table data showing

            those.lineChart1.data.labels.push(xdt);
            those.lineChart1.options = {
                low: 0,
                showArea: true,
                fullWidth: true
            }
            those.scrollEvent();
            those.lineChartData[0].data.push(data.price_str);
            those.lineChartLabels.push(xdt);
            those.lineChartData = those.lineChartData;
            those.lineChartLabels = those.lineChartLabels;
            if (those.chart.chart)
                those.chart.chart.update();
            //those.lineChartData.update();
        })
    }
    graphSetter(evt) {
        var x = evt;
        this.dashboardService.lineGraph(evt).subscribe((ed) => {
            this.lineChart1.data = ed[x];
            this.lineChart1.options = {
                low: 0,
                showArea: true,
                fullWidth: true
            }
            this.lineChartData[0].data = [];
            this.lineChartLabels = [];
            for (var z = 0; z < ed[x].labels.length; z++) {
                this.lineChartData[0].data.push(this.lineChart1.data.series[0][z]);
                this.lineChartLabels.push(ed[x].labels[z]);
            }
            this.preVal = Object.keys(pusherz.channels.channels);
            this.my_channel = pusherz.unsubscribe(this.preVal[0]);
            this.janvar=[];

            this.valSetter();
            this.scrollEvent();
        });
    }
    ngAfterViewInit() {
        //Sparkline chart
        var sparklineLogin = function () {
            // spark count
            $('.spark-count').sparkline([4, 5, 9, 2, 12, 5, 10, 9, 2, 3, 4, 12, 4, 9], {
                type: 'bar'
                , width: '100%'
                , height: '70'
                , barWidth: '4'
                , resize: true
                , barSpacing: '6'
                , barColor: 'rgba(255, 255, 255, 0.3)'
            });
        }
        var sparkResize;
        $(window).resize(function (e) {
            clearTimeout(sparkResize);
            sparkResize = setTimeout(sparklineLogin, 500);
        });
        $(document).ready(function () {
            sparklineLogin();
        });

    }

    scrollEvent() {
        var xwidth;
        xwidth = $('.linearea').width();
        if (xwidth < 25000) {
            var x = xwidth * 2 / 100;
            xwidth += x;
        } else {
            xwidth += 50;
        }
        $('.barchrt').width(xwidth);
    }


    ngOnDestroy() {
    }
}
