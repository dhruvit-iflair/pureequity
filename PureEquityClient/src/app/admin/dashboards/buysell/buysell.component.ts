import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';

@Component({
  selector: 'app-buysell',
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuysellComponent implements OnInit {

  public buysellForm: FormGroup;
  public sellForm: FormGroup;
  constructor(private fb: FormBuilder, private http: Http, private router: Router, private toastr: ToastrService) { }
  availableBalance; pureequityfee = '0.25%';
  enablesellcontainer = false; enablebuycontainer = false;
  bidprice:any; 
  availBalance:any; 
  orderbook:any;
  public payPalConfig:PayPalConfig;
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
  ngOnInit() {
    this.buysellForm = this.fb.group({
      amount: [null, Validators.compose([Validators.required])],
      subtotal: [null],
      fee: [this.pureequityfee],
      estimation: [null]
    });
    this.sellForm = this.fb.group({
      amount: [null, Validators.compose([Validators.required])],
      subtotal: [null],
      fee: [this.pureequityfee],
      estimation: [null]
    });
    this.initConfig();
    this.http.get(environment.tradingApi + '/balance/btcusd')
      .subscribe((resp) => {
        this.availBalance = resp.json();
      }, (er) => {
        var err = er.json();
        console.log(err);
      });

    setInterval(() => {
      this.orders();
    }, 1000);
  }

  orders() {
    this.http.get(environment.tradingApi + '/orderBook/btcusd')
      .subscribe((resp) => {
        this.orderbook = resp.json();
      }, (er) => {
        var err = er.json();
        console.log(err);
      });
  }
  enablebuybtc() {
    this.enablesellcontainer = false;
    this.enablebuycontainer = true;
    this.availableBalance = this.availBalance.payload.data.usd_available + ' USD';
  }
  enablesellbtc() {
    this.enablebuycontainer = false;
    this.enablesellcontainer = true;
    this.availableBalance = this.availBalance.payload.data.btc_available + ' BTC';
  }
  estimation() {
    this.http.get(environment.tradingApi + '/coins/btcusd').subscribe((data) => {
      var respdata = data.json();
      this.bidprice = parseFloat(respdata.payload.data.bid);
      if (this.enablebuycontainer) {
        var subtotal = parseFloat(this.buysellForm.value.amount) - parseFloat(this.pureequityfee);
        var estbtc = subtotal / respdata.payload.data.ask;
        this.buysellForm.patchValue({ subtotal: subtotal + ' USD', estimation: estbtc });
      }
      else {
        var subtotl = parseFloat(this.sellForm.value.amount) * parseFloat(respdata.payload.data.ask);
        var deductableusd = subtotl * parseFloat(this.pureequityfee) / 100;
        var estusd = subtotl - deductableusd;
        this.sellForm.patchValue({ subtotal: subtotl + ' USD', estimation: estusd });
      }
    });
  }
  buybtc() {
    var amountval = parseFloat(this.buysellForm.value.estimation).toFixed(6);
    var obj = { amount: parseFloat(amountval), price: this.bidprice };
    this.http.post(environment.tradingApi + '/buy/btcusd', obj)
      .subscribe((resp) => {
        console.log(resp);
        this.toastr.success('Transactions Success');
      }, (er) => {
        var err = er.json();
        console.log(err);
        this.toastr.error(err.message, 'Error');
      });
  }
  sellbtc() {
    var amountval = parseFloat(this.sellForm.value.amount).toFixed(6);
    var obj = { amount: parseFloat(amountval), price: this.bidprice };
    //var obj={amount:this.buysellForm.value.amount,price:this.bidprice};
    this.http.post(environment.tradingApi + '/sell/btcusd', obj)
      .subscribe((resp) => {
        console.log(resp);
        this.toastr.success('Transactions Success');
      }, (er) => {
        var err = er.json();
        console.log(err);
        this.toastr.error(err.message, 'Error');
      });
  }
  public initConfig(): void {
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        //sandbox: 'Aeamyh5lUwM_7UJ315iLUfUyzpSFM0CcUYrRT3AWQ_ZgUw8paOZ3wWy_kVvNBCecx-Ow1PPm48JMWiQp'
        sandbox: 'AVqzRIHlt-B85qMxjL6_GDHYaVp5djMAXVL7ecX4BRySstGdryEJOpPT9eYKKIKihIf3KEo-RMfkl76h'
        //sandbox: 'ATNZuTAAZ0D_PYa_B_TrT2bzYRNhBBgE-QZIvAPGZGfS4RM_W-U6kRbFvjcGNgp0hicne7_jKwsYiLaU'
      },
      button: {
        label: 'paypal',
      },
      onPaymentComplete: (data, actions) => {
        console.log(data);
        console.log('OnPaymentComplete');
        console.log(actions);
        this.toastr.success('Payment Success!','Success');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError'+err);
        this.toastr.error('Something Went Wrong!','Error');
      },
      transactions: [{
        amount: {
          currency: 'GBP',
          total: 1100.55
        }
      }]
    });
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
