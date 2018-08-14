import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar } from '@angular/material';
import { CoinBalance, Balance } from '../buysell.component';
import { TradeRecord , TradeService} from '../../../shared/services/trade.service';
import { LimitOrderService } from '../../../shared/services/limit-order.service';

@Component({
    selector: 'app-limit-order',
    templateUrl: './limit-order.component.html',
    styleUrls: ['./limit-order.component.css']
})
export class LimitOrderComponent implements OnInit {
    public buyAmount : FormControl;
    public buyPrice : FormControl;
    public sellAmount : FormControl;
    public sellPrice : FormControl;

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

    public formResetSub:any;
    constructor(public fb: FormBuilder, private http: HttpClient, private snakebar: MatSnackBar,public limitOrderService:LimitOrderService, public tradeService:TradeService) { }

    ngOnInit() {
        this.buyAmount = new FormControl('' ,[Validators.required,this.MinBuyValidation()]);
        this.buyPrice = new FormControl('',[Validators.required]);

        this.sellAmount = new FormControl('' ,[Validators.required,this.MinSellValidation()]);
        this.sellPrice = new FormControl('',[Validators.required]);
        this.total = {
            buy: 0.00,
            sell: 0.00
        }
        this.setInitialValue();
        this.buyAmount.valueChanges.subscribe((data) => {
            this.calcBuy();
        })
        this.sellAmount.valueChanges.subscribe((data) => {
            this.calcSell();
        })
        this.buyPrice.valueChanges.subscribe((data) => {
            this.calcBuy();
        })
        this.sellPrice.valueChanges.subscribe((data) => {
            this.calcSell();
        })
        this.formResetSub = this.limitOrderService.formReset.subscribe(form=>{
            if (form && form == 'buy') {
                this.buyAmount.reset();
                this.buyPrice.reset();
            }
            else {
                this.sellAmount.reset();
                this.sellPrice.reset();
            }
            this.setInitialValue();
        })
    }
    MinBuyValidation(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (control.value >= this.activeTrade.minSell) {
                return null;
            } else {
                return {minBuyValue:true};
            }
        };
    }

    MinSellValidation(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (control.value >= this.activeTrade.minSell) {
                return null;
            } else {
                return {minSellValue:true};
            }
        };
    }
    setInitialValue() {
        this.http.get(environment.tradingApi + "/coins/" + this.activeTrade.value.toLowerCase()).subscribe((data: any) => {
            let payload = data
            this.current_payload = data;
            this.buyPrice.patchValue(payload.payload.data.ask);
            this.sellPrice.patchValue(payload.payload.data.bid);
        });
    }
    calcBuy() {
        this.total.buy = this.buyAmount.value * this.buyPrice.value;
    }
    calcSell() {
        this.total.sell = this.sellAmount.value * this.sellPrice.value
    }
    ngOnChanges(changes: any) {
        if (changes && changes.activeTrade && (changes.activeTrade.firstChange == false)) {
            this.setInitialValue();
            this.buyAmount.patchValue(this.buyAmount.value);
            this.sellAmount.patchValue(this.sellAmount.value);
        }
    }
    buy(){
        let obj = {
            amount: this.buyAmount.value,
            price: this.current_payload.payload.data.ask,
            limitPrice: this.buyPrice.value,
        };
        this.limitOrderService.buyLimitOrder(obj.amount,obj.limitPrice,obj.amount*obj.limitPrice);
    }
    sell(){
        let obj = {
            amount: this.sellAmount.value,
            price: this.current_payload.payload.data.bid,
            limitPrice: this.sellPrice.value,
        };
        this.limitOrderService.sellLimitOrder(obj.amount,obj.limitPrice,obj.amount*obj.limitPrice);
    }
}

