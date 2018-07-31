import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";

@Component({
    selector: "app-market-order",
    templateUrl: "./market-order.component.html",
    styleUrls: ["./market-order.component.css"]
})
export class MarketOrderComponent implements OnInit {
    @Input() availableBalanceBuy: any;
    @Input() availableBalanceSell: any;
    @Input() tradeCoin: any;

    public marketOrderBuyForm: FormGroup;
    public marketOrderSellForm: FormGroup;
    public subtotal: {
        buy: any,
        sell: any
    } = {
            buy: 0,
            sell: 0
        };
    public fees: {
        buy: any,
        sell: any
    } = {
            buy: 0,
            sell: 0
        };
    public pureequityfee: any = 0.25;
    constructor(public fb: FormBuilder, private http: HttpClient) { }

    ngOnInit() {
        // this.subtotal.buy = 0.00;
        // this.fees.buy = 0.00;
        // this.subtotal.sell = 0.00;
        // this.fees.sell = 0.00;
        this.marketOrderBuyForm = this.fb.group({
            amount: ["", Validators.required],
            buyprice: ["", Validators.required]
        });
        this.marketOrderSellForm = this.fb.group({
            amount: ["", Validators.required],
            sellprice: ["", Validators.required]
        });
        this.marketOrderBuyForm.valueChanges.subscribe(data => {
            this.calcBuy();
        });
        this.marketOrderSellForm.valueChanges.subscribe(data => {
            this.calcSell();
        });
    }
    setInitialValue() {
        return this.http.get(
            environment.tradingApi +
            "/coins/" +
            this.tradeCoin.slice(0, 3).toLowerCase() +
            this.tradeCoin.slice(6, 9).toLowerCase()
        );
    }
    calcBuy() {
        let allData = this.marketOrderBuyForm.value;
        if (allData.amount > 0) {
            this.setInitialValue().subscribe((data: any) => {
                let payload = data.payload.data;
                let cal1 = allData.amount * payload.ask;
                this.subtotal.buy = (cal1 + (cal1 * this.pureequityfee) / 100).toFixed(4);
                this.fees.buy = ((cal1 * this.pureequityfee) / 100).toFixed(4);
            });
        } else {
            this.subtotal.buy = 0.0;
            this.fees.buy = 0.0;
        }
    }
    calcSell() {
        let allData = this.marketOrderSellForm.value;
        if (allData.amount > 0) {
            this.setInitialValue().subscribe((data: any) => {
                let payload = data.payload.data;
                let cal1 = allData.amount * payload.ask;
                this.subtotal.sell = (cal1 - (cal1 * this.pureequityfee) / 100).toFixed(4);
                this.fees.sell = ((cal1 * this.pureequityfee) / 100).toFixed(4);
            });
        } else {
            this.subtotal.sell = 0.0;
            this.fees.sell = 0.0;
        }
    }
    ngOnChanges(changes: any) {
        console.log(changes.tradeCoin);
        if (
            changes &&
            changes.tradeCoin &&
            changes.tradeCoin.firstChange == false
        ) {
            this.calcBuy();
            this.calcSell();
        }
    }


}
