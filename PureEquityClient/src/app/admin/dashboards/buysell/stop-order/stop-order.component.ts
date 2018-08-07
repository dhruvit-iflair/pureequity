import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoinBalance, Balance } from '../buysell.component';
import { TradeRecord } from '../../../shared/services/trade.service';

@Component({
    selector: 'app-stop-order',
    templateUrl: './stop-order.component.html',
    styleUrls: ['./stop-order.component.css']
})
export class StopOrderComponent implements OnInit {
    // @Input() availableBalanceBuy: any;
    // @Input() availableBalanceSell: any;
    // @Input() tradeCoin: any;
    // @Input() coinBalance: CoinBalance;
    @Input() activeTrade : TradeRecord;
    @Input() coinBalance:CoinBalance;
    @Input() moneyBalance:CoinBalance;
    @Input() activeCoinBalance:Balance;
    @Input() activeMoneyBalance:Balance;

    public stopOrderBuyForm: FormGroup;
    public stopOrderSellForm: FormGroup;

    constructor(public fb: FormBuilder) { }

    ngOnInit() {
        this.stopOrderBuyForm = this.fb.group({
            amount: ['', Validators.required],
            priceRice: [''],
            trailing: [''],
        })
        this.stopOrderSellForm = this.fb.group({
            amount: ['', Validators.required],
            priceFalls: [''],
            trailing: [''],
        })
    }


}
