import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-limit-order',
    templateUrl: './limit-order.component.html',
    styleUrls: ['./limit-order.component.css']
})
export class LimitOrderComponent implements OnInit {
    public limitOrderBuyForm: FormGroup;
    public limitOrderSellForm: FormGroup;
    @Input() availableBalanceBuy: any;
    @Input() availableBalanceSell: any;
    @Input() tradeCoin: any;
    public total: {
        buy: Number,
        sell: Number
    }
    constructor(public fb: FormBuilder, private http: HttpClient) { }

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
        this.http.get(environment.tradingApi + "/coins/" + this.tradeCoin.slice(0, 3).toLowerCase() + this.tradeCoin.slice(6, 9).toLowerCase()).subscribe((data: any) => {
            let payload = data
            this.limitOrderBuyForm.patchValue({ buyprice: payload.payload.data.ask });
            this.limitOrderSellForm.patchValue({ sellprice: payload.payload.data.ask });
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
}

