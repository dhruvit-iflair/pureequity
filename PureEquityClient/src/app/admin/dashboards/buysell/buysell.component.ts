import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../../environments/environment';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-buysell',
  templateUrl: './buysell.component.html',
  styleUrls: ['./buysell.component.css']
})
export class BuysellComponent implements OnInit {

  public buysellForm: FormGroup;
  public sellForm: FormGroup;
  constructor(private fb: FormBuilder, private http: Http, private router: Router, private snakebar: MatSnackBar, private toastr: ToastrService) { }
  availableBalanceBuy; availableBalanceSell; pureequityfee = '0.25%';
  enablesellcontainer = false; enablebuycontainer = false;
  bidprice: any; chipsValue = 'btcusd';
  availBalance: any;
  orderbook: any;
  estimate: any;
  fees: any;
  private history: any;
  public payPalConfig: PayPalConfig;
  public tradeCoin: String = 'BTC / USD';
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
  public sideNave: any[] = [
    { name: 'Instant Order (Simple)', isActive: true, },
    { name: 'Limit Order (Advanced)', isActive: false, },
    { name: 'Market Order (Advanced)', isActive: false, },
    { name: 'Stop Order (Advanced)', isActive: false, }
  ]
  tokendata;
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
    var token = JSON.parse(localStorage.getItem('token'));
    this.tokendata = token;
    this.http.get(environment.api + '/history/user/' + token.user._id).subscribe((res: any) => {
      var d = res.json();
      if (d && d.transactions) {
        this.history = d;
      }
    }, (error) => {
      console.log(error);
    })
    this.http.get(environment.tradingApi + '/balance/btcusd')
      .subscribe((resp) => {
        this.availBalance = resp.json();
        this.availableBalanceBuy = this.availBalance.payload.data.usd_available + ' USD'
        this.availableBalanceSell = this.availBalance.payload.data.btc_available + ' BTC';
      }, (er) => {
        var err = er.json();
        console.log(err);
      });

    // setInterval(() => {
    //   this.orders();
    // }, 10000);
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
  setBalance(coinval) {
    this.http.get(environment.tradingApi + '/balance/' + coinval)
      .subscribe((resp) => {
        this.availBalance = resp.json();
        var key1 = Object.keys(this.availBalance.payload.data)[0];
        var key2 = Object.keys(this.availBalance.payload.data)[4];
        var lbl1 = key1.split('_');
        var lbl2 = key2.split('_');
        this.availableBalanceBuy = this.availBalance.payload.data[key1] + ' ' + lbl1[0].toUpperCase();
        this.availableBalanceSell = this.availBalance.payload.data[key2] + ' ' + lbl2[0].toUpperCase();
      }, (er) => {
        var err = er.json();
        console.log(err);
      });
  }
  enablebuybtc() {
    this.enablesellcontainer = false;
    this.enablebuycontainer = true;
    // this.availableBalance = this.availBalance.payload.data.usd_available + ' USD';
  }
  enablesellbtc() {
    this.enablebuycontainer = false;
    this.enablesellcontainer = true;
    // this.availableBalance = this.availBalance.payload.data.btc_available + ' BTC';
  }
  estimation(enablebuycontainer) {
    this.http.get(environment.tradingApi + '/coins/' + this.chipsValue).subscribe((data) => {
      var respdata = data.json();
      this.bidprice = parseFloat(respdata.payload.data.bid);
      // this.estimate = respdata.payload.data;
      console.log(this.bidprice);
      if (enablebuycontainer) {
        var tempval = parseFloat(this.pureequityfee) / 100;
        var subtotal = parseFloat(this.buysellForm.value.amount) - tempval;
        var estbtc = subtotal / this.bidprice;
        //this.fees = this.buysellForm.value.amount - subtotal;
        this.buysellForm.patchValue({ subtotal: subtotal, estimation: estbtc });
      }
      else {
        //var tempval= parseFloat(this.pureequityfee)/100;
        var subtotl = parseFloat(this.sellForm.value.amount);
        //var deductableusd = subtotl * parseFloat(this.pureequityfee) / 100;
        var estusd = subtotl / this.bidprice;
        //this.fees = deductableusd;        
        this.sellForm.patchValue({ subtotal: subtotl, estimation: estusd });
      }
    });
  }
  buybtc() {
    if (this.history && this.history.transactions) {
      this.history.transactions.push({
        transaction_type: 'buy',
        time: Date.now(),
        account: 'Main Account',
        amount: {
          amount: this.buysellForm.value.amount,
          currency: 'USD'
        },
        value: {
          amount: parseFloat(this.buysellForm.value.estimation).toFixed(6),
          currency: 'BTC'
        },
        rate: {
          amount: this.bidprice,
          currency: 'USD'
        },
        fees: {
          amount: this.fees,
          currency: 'USD'
        }
      })
    }
    else {
      var token = JSON.parse(localStorage.getItem('token'));
      var transactions = [];
      transactions.push({
        transaction_type: 'buy',
        time: Date.now(),
        account: 'Main Account',
        amount: {
          amount: this.buysellForm.value.amount,
          currency: 'USD'
        },
        value: {
          amount: parseFloat(this.buysellForm.value.estimation).toFixed(6),
          currency: 'BTC'
        },
        rate: {
          amount: this.bidprice,
          currency: 'USD'
        },
        fees: {
          amount: this.fees,
          currency: 'USD'
        }
      })
      this.history = {
        transactions: transactions,
        user: token.user._id
      }
    }
    if (this.tokendata.user.is2FAEnabled) {
      this.saveHistory(this.history);
      var amountval = parseFloat(this.buysellForm.value.estimation).toFixed(6);
      var obj = { amount: parseFloat(amountval), price: this.bidprice };
      console.log(obj);
      // this.http.post(environment.tradingApi + '/buy/btcusd', obj)
      //   .subscribe((resp) => {
      //     console.log(resp);
      //     this.toastr.success('Transactions Success');
      //   }, (er) => {
      //     var err = er.json();
      //     console.log(err);
      //     this.toastr.error(err.message, 'Error');
      //   });
    }
    else {
      this.snakebar.open('You are requested to enable 2FA from security to keep using Pure Equity platform.', '', { duration: 5000 });
    }
  }
  sellbtc() {
    if (this.history && this.history.transactions) {
      this.history.transactions.push({
        transaction_type: 'sell',
        time: Date.now(),
        account: 'Main Account',
        amount: {
          amount: this.sellForm.value.amount,
          currency: 'USD'
        },
        value: {
          amount: parseFloat(this.sellForm.value.estimation).toFixed(6),
          currency: 'BTC'
        },
        rate: {
          amount: this.bidprice,
          currency: 'USD'
        },
        fees: {
          amount: this.fees,
          currency: 'USD'
        }
      })
    } else {
      var token = JSON.parse(localStorage.getItem('token'));
      var transactions = [];
      transactions.push({
        transaction_type: 'buy',
        time: Date.now(),
        account: 'Main Account',
        amount: {
          amount: this.sellForm.value.amount,
          currency: 'USD'
        },
        value: {
          amount: parseFloat(this.sellForm.value.estimation).toFixed(6),
          currency: 'BTC'
        },
        rate: {
          amount: this.bidprice,
          currency: 'USD'
        },
        fees: {
          amount: this.fees,
          currency: 'USD'
        }
      })
      this.history = {
        transactions: transactions,
        user: token.user._id
      }
    }
    if (this.tokendata.user.is2FAEnabled) {
      this.saveHistory(this.history);
      var amountval = parseFloat(this.sellForm.value.amount).toFixed(6);
      var obj = { amount: parseFloat(amountval), price: this.bidprice };
      console.log(obj);
      //var obj={amount:this.buysellForm.value.amount,price:this.bidprice};
      // this.http.post(environment.tradingApi + '/sell/btcusd', obj)
      //   .subscribe((resp) => {
      //     console.log(resp);
      //     this.toastr.success('Transactions Success');
      //   }, (er) => {
      //     var err = er.json();
      //     console.log(err);
      //     this.toastr.error(err.message, 'Error');
      //   });
    }
    else {
      this.snakebar.open('You are requested to enable 2FA from security to keep using Pure Equity platform.', '', { duration: 5000 });
    }
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
        this.toastr.success('Payment Success!', 'Success');
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError' + err);
        this.toastr.error('Something Went Wrong!', 'Error');
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
      this.tradeList.map(t => {
        t.isActive = false
      });
      this.tradeList[i].isActive = !this.tradeList[i].isActive;
      this.tradeCoin = this.tradeList[i].name;
      this.chipsValue = this.tradeList[i].value;
      this.setBalance(this.chipsValue);
    }
  }
  toggleSideMenu(i) {
    if (!this.sideNave[i].isActive) {
      this.sideNave.map(t => {
        t.isActive = false
      });
      this.sideNave[i].isActive = !this.sideNave[i].isActive;
    }
  }
  saveHistory(data) {
    if (data['_id']) {
      this.http.put(environment.api + '/history/' + data._id, data).subscribe((res: any) => {
        console.log(res);
        this.history = res.json();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.http.post(environment.api + '/history', data).subscribe((res: any) => {
        console.log(res);
        this.history = res.json();
      }, (error) => {
        console.log(error);
      })
    }
  }
}
