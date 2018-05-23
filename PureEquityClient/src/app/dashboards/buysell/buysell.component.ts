import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { Http } from "@angular/http";
import { environment } from '../../../environments/environment';

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
  bidprice; availBalance; orderbook;
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
}
