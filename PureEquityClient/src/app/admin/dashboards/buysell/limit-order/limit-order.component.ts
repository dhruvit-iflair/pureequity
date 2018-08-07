import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { CoinBalance, Balance } from '../buysell.component';
import { TradeRecord } from '../../../shared/services/trade.service';

@Component({
    selector: 'app-limit-order',
    templateUrl: './limit-order.component.html',
    styleUrls: ['./limit-order.component.css']
})
export class LimitOrderComponent implements OnInit {
    public limitOrderBuyForm: FormGroup;
    public limitOrderSellForm: FormGroup;
    // @Input() availableBalanceBuy: any;
    // @Input() availableBalanceSell: any;
    // @Input() tradeCoin: any;
    @Input() activeTrade : TradeRecord;
    @Input() coinBalance:CoinBalance;
    @Input() moneyBalance:CoinBalance;
    @Input() activeCoinBalance:Balance;
    @Input() activeMoneyBalance:Balance;

    public total: {
        buy: Number,
        sell: Number
    }
    public current_payload : any;
    constructor(public fb: FormBuilder, private http: HttpClient, private snakebar: MatSnackBar,) { }

    ngOnInit() {
        this.limitOrderBuyForm = this.fb.group({
            amount: ['', Validators.required],
            buyprice: ['', Validators.required]
        })
        this.limitOrderSellForm = this.fb.group({
            amount: ['', Validators.required],
            sellprice: ['', Validators.required]
        })
        this.total = {
            buy: 0.00,
            sell: 0.00
        }
        this.setInitialValue();
        this.limitOrderBuyForm.valueChanges.subscribe((data) => {
            this.calcBuy();
        })
        this.limitOrderSellForm.valueChanges.subscribe((data) => {
            this.calcSell();
        })
    }
    setInitialValue() {
        this.http.get(environment.tradingApi + "/coins/" + this.activeTrade.value.toLowerCase()).subscribe((data: any) => {
            let payload = data
            this.current_payload = data;
            this.limitOrderBuyForm.patchValue({ buyprice: payload.payload.data.ask });
            this.limitOrderSellForm.patchValue({ sellprice: payload.payload.data.bid });
        });
    }
    calcBuy() {
        let allData = this.limitOrderBuyForm.value;
        this.total.buy = allData.amount * allData.buyprice;
    }
    calcSell() {
        let allData = this.limitOrderSellForm.value;
        this.total.sell = allData.amount * allData.sellprice;
    }
    ngOnChanges(changes: any) {
        console.log(changes.tradeCoin);
        if (changes && changes.tradeCoin && (changes.tradeCoin.firstChange == false)) {
            this.setInitialValue();
        }
    }
    buy(){
        let obj = {
            amount: this.limitOrderBuyForm.value.amount,
            price: this.current_payload.payload.data.ask,
            limitPrice: this.limitOrderBuyForm.value.buyprice,
        };
        // this.http.post(environment.tradingApi + '/buyLimit/'+this.activeTrade.value.toLowerCase(), obj).subscribe((resp) => {
        //     console.log(resp);
        //     this.snakebar.open("Transactions Success", "", { duration: 5000 });
        // }, (er) => {
        //     var err = er
        //     console.log(err);
        //     this.snakebar.open(err.error.message, "", { duration: 5000 });
        // });
    }
    sell(){
        let obj = {
            amount: this.limitOrderSellForm.value.amount,
            price: this.current_payload.payload.data.bid,
            limitPrice: this.limitOrderSellForm.value.sellprice,
        };
        // this.http.post(environment.tradingApi + '/sellLimit/'+this.activeTrade.value.toLowerCase(), obj).subscribe((resp) => {
        //     console.log(resp);
        //     this.snakebar.open("Transactions Success", "", { duration: 5000 });
        // }, (er) => {
        //     var err = er
        //     console.log(err);
        //     this.snakebar.open(err.error.message, "", { duration: 5000 });
        // });
    }
}

