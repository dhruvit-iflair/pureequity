import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
    ValidatorFn,
    AbstractControl
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CustomValidators } from "ng2-validation";
import { Http } from "@angular/http";
import { environment } from "../../../../environments/environment";
import { MatSnackBar } from "@angular/material";
import { CoinBalanceService } from "../../shared/services/coinBalance.service";
import { TradeRecord, TradeService } from "../../shared/services/trade.service";
import { InstantOrderBuyService } from "../../shared/services/instant-order-buy.service";
import { InstantOrderSellService } from "../../shared/services/instant-order-sell.service";
import { CoinsService } from "../../shared/services/coins.service";
import { MoneyService } from "../../shared/services/money.service";

@Component({
    selector: "app-buysell",
    templateUrl: "./buysell.component.html",
    styleUrls: ["./buysell.component.css"]
})
export class BuysellComponent implements OnInit {
    // Data
    public tradeList:Array<TradeRecord> = this.tradeService.getTradeData();
    public sideNave: any[] = [
        { name: "Instant Order (Simple)", isActive: true },
        { name: "Limit Order (Advanced)", isActive: false },
        { name: "Market Order (Advanced)", isActive: false },
        { name: "Stop Order (Advanced)", isActive: false }
    ];
    public activeTrade : TradeRecord = { name: "BTC / USD", isActive: true, value: "btcusd", data: [], minBuy:6,minSell:5 };
    public coinBalance:CoinBalance;
    public moneyBalance:CoinBalance;
    public activeCoinBalance:Balance;
    public activeMoneyBalance:Balance;
    public coinTransactions:any;
    public moneyTransactions:any;

    // Subscribtion
    public activeTradeSubscribtion : any;
    public tradeSubscribtion :any;
    public buyCalculationResultSub: any;
    public sellCalculationResultSub: any;
    public coinBSub : any;
    public moneyBSub : any;

    // FormControls
    public buyAmount :FormControl;
    public buySubtotal :FormControl;
    public buyFees :FormControl;
    public buyReceive :FormControl;
    public buyActual:any;

    public sellAmount :FormControl;
    public sellSubtotal :FormControl;
    public sellFees :FormControl;
    public sellReceive :FormControl;
    public sellActual:any;

    constructor(
        public tradeService:TradeService,
        public instOBuyService:InstantOrderBuyService,
        public instOSellService:InstantOrderSellService,
        public coinService:CoinsService,
        public moneyService:MoneyService,
        public snakbar:MatSnackBar
    ) { }

    ngOnInit() {
        this.buyAmount = new FormControl('' ,[Validators.required]); // ,MinBuyValidation(this.activeTrade.minBuy)
        this.buySubtotal = new FormControl('');
        this.buyFees = new FormControl('0.25%');
        this.buyReceive = new FormControl('');

        this.sellAmount = new FormControl('' ,[Validators.required]); // ,MinSellValidation(this.activeTrade.minSell)
        this.sellSubtotal = new FormControl('');
        this.sellFees = new FormControl('0.25%');
        this.sellReceive = new FormControl('');

        this.activeTradeSubscribtion = this.tradeService.getActiveTrade().subscribe(activeTrade=>{
            this.activeTrade = activeTrade;
            (this.buyAmount.value > 0)? this.instOBuyService.calcBuy(this.buyAmount.value):null;
            (this.sellAmount.value > 0)? this.instOSellService.calcSell(this.sellAmount.value):null;
            (this.coinBalance)? this.setCoinBalance(): null;
            (this.moneyBalance)? this.setMoneyBalance() : null;
            // console.log(activeTrade);
        });
        this.tradeSubscribtion = this.tradeService.getTradeList().subscribe(trade=>{
            this.tradeList = trade
            // console.log(trade);
        });
        this.buyAmount.valueChanges.subscribe(data=>{
           console.log(data);
           if(data > 0 && data != null && this.buyAmount.valid) {
               this.instOBuyService.calcBuy(data);
            }
            else {
                this.buySubtotal.reset();
                this.buyReceive.reset();
            }
        });
        this.sellAmount.valueChanges.subscribe(data=>{
            console.log(data);
            if(data > 0 || !data == null) {
                this.instOSellService.calcSell(data);
             }
             else {
                 this.sellSubtotal.reset();
                 this.sellReceive.reset();
             }
        });

        this.buyCalculationResultSub = this.instOBuyService.getBuyCalculationResult().subscribe((result:any)=>{
            if (result) {
                this.buySubtotal.patchValue((result.buySubtotal)? result.buySubtotal : 0);
                this.buyReceive.patchValue((result.buyReceive)? result.buyReceive : 0);
                this.buyActual = (result.buyActual)? result.buyActual : 0;
            } else {
                this.buyAmount.reset();
                this.buySubtotal.reset();
                this.buyReceive.reset();
                this.buyActual = 0;
            }
        });
        this.sellCalculationResultSub = this.instOSellService.getSellCalculationResult().subscribe((result:any)=>{
            if (result) {
                this.sellSubtotal.patchValue((result.sellSubtotal)?result.sellSubtotal : 0);
                this.sellReceive.patchValue((result.sellReceive)?result.sellReceive : 0);
                this.sellActual = (result.sellActual)?result.sellActual : 0
            } else {
                this.sellAmount.reset();
                this.sellSubtotal.reset();
                this.sellReceive.reset();
                this.sellActual = 0;
            }
        });

        this.coinBSub = this.coinService.getCoinBalance().subscribe(bal=>{
            this.coinBalance = bal;
            this.setCoinBalance();
        });
        this.coinService.refreshCoinBalance();
        this.moneyBSub = this.moneyService.getMoneyBalance().subscribe(bal=>{
            this.moneyBalance = bal;
            this.setMoneyBalance();
        });
        this.moneyService.refreshMoneyBalance();
    }
    ngOnDestroy(){
        this.activeTradeSubscribtion.unsubscribe();
        this.tradeSubscribtion.unsubscribe();
        this.buyCalculationResultSub.unsubscribe();
        this.sellCalculationResultSub.unsubscribe();
        this.coinBSub.unsubscribe();
        this.moneyBSub.unsubscribe();
    }

    setCoinBalance(){
        let cb_1 = this.coinBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(0,3).toLowerCase());
        let cb_2 = this.coinBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(3,6).toLowerCase());
        (cb_1 && !cb_2)? this.activeCoinBalance = cb_1 : null;
        (!cb_1 && cb_2 )? this.activeMoneyBalance = cb_2 : null;
        if(cb_1 && cb_2) { this.activeMoneyBalance = cb_2 ; this.activeCoinBalance = cb_1 };
    }

    setMoneyBalance(){
        let mb_1 = this.moneyBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(3,6).toLowerCase());
        let mb_2 = this.moneyBalance.balance.find(cb => cb.coin.toLowerCase() === this.activeTrade.value.slice(0,3).toLowerCase());
        (mb_1 && !mb_2)? this.activeMoneyBalance = mb_1 : null;
        (mb_2 && !mb_1)? this.activeCoinBalance = mb_2 : null;
        if(mb_1 && mb_2){ this.activeMoneyBalance = mb_1 ; this.activeCoinBalance = mb_2 };
    }

    toggleSideMenu(i) {
        if (!this.sideNave[i].isActive) {
            this.sideNave.map(t => {
                t.isActive = false;
            });
            this.sideNave[i].isActive = !this.sideNave[i].isActive;
        }
    }

    buy(){
        if(this.activeMoneyBalance.balance >= this.buyAmount.value){
            this.instOBuyService.buy(this.buyAmount.value, this.buyReceive.value,this.buyActual);
        }
        else {
            this.snakbar.open(`You account does not contail sufficent ${this.activeMoneyBalance.coin.toUpperCase()} to buy ${this.activeCoinBalance.coin.toUpperCase()}`, "", { duration: 4000 });
        }
    }
    sell(){
        if(this.activeCoinBalance.balance >= this.sellAmount.value){
            this.instOSellService.sell(this.sellAmount.value, this.sellReceive.value,this.sellActual);
        }
        else {
            this.snakbar.open(`You account does not contail sufficent ${this.activeCoinBalance.coin.toUpperCase()} to sell`, "", { duration: 4000 });
        }
    }

}

export interface CoinBalance {
    user: String,
    balance: Array<Balance>,
    created_at: Date,
    updated_at: Date,
    createdBy: String,
    updatedBy: String
}
export interface Balance {
    coin: String,
    balance: number,
    _id: false,
}



// let token = JSON.parse(localStorage.getItem('token'));
            // let trans = {
            //     user : token.user._id,
            //     transaction_type: "IOB",
            //     time: Date.now(),
            //     account: "Main Account",
            //     amount: {
            //         amount: this.buyAmount.value,
            //         currency: this.activeMoneyBalance.coin
            //     },
            //     // subtotal: {
            //     //     amount: this.buySubtotal.value,
            //     //     currency: this.activeMoneyBalance.coin
            //     // },
            //     // value: {
            //     //     amount: this.buyReceive.value,
            //     //     currency: this.activeCoinBalance.coin
            //     // },
            //     // rate: {
            //     //     amount: this.current_payload.payload.data.ask,
            //     //     currency: this.tradeCoin.slice(6, 9)
            //     // },
            //     // fees: {
            //     //     amount: this.buysellForm.value.amount - this.buydata.subtotal,
            //     //     currency: this.tradeCoin.slice(6, 9)
            //     // }
            // }
            // console.log(trans);


// export function MinBuyValidation(minValue:number): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//         if (control.value >= minValue) {
//             return null;
//         } else {
//             return {minBuyValue:true};
//         }
//     //   return minValue ? {'minValue': {value: control.value}} : null;
//     };
// }

// export function MinSellValidation(minValue:number): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//         minValue =
//         if (control.value >= minValue) {
//             return null;
//         } else {
//             return {minBuyValue:true};
//         }
//     //   return minValue ? {'minValue': {value: control.value}} : null;
//     };
// }
