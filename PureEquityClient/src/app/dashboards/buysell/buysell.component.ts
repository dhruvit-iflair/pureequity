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
  availableBalance;pureequityfee='0.25%';
  enablesellcontainer=false;enablebuycontainer=false;
  
  ngOnInit() {
    this.buysellForm = this.fb.group({
      amount: [null, Validators.compose([Validators.required])],
      subtotal:[null],
      fee:[this.pureequityfee],
      estimation:[null]
    });
    this.sellForm = this.fb.group({
      amount: [null, Validators.compose([Validators.required])],
      subtotal:[null],
      fee:[this.pureequityfee],
      estimation:[null]
    });
  }
  enablebuybtc(){
    this.enablesellcontainer=false;
    this.enablebuycontainer=true;
    this.availableBalance='154.8524 USD';
  }
  enablesellbtc(){
    this.enablebuycontainer=false;
    this.enablesellcontainer=true;
    this.availableBalance='4.1524 BTC';
  }
  estimation(){
    this.http.get(environment.tradingApi+'/coins/btcusd').subscribe((data)=>{
      var respdata=data.json();
      if(this.enablebuycontainer){
        var subtotal = parseFloat(this.buysellForm.value.amount)-parseFloat(this.pureequityfee);
        var estbtc= subtotal/respdata.payload.data.ask;
        this.buysellForm.patchValue({subtotal:subtotal+' USD',estimation:estbtc});
      }
      else{
        var subtotl = parseFloat(this.sellForm.value.amount)*parseFloat(respdata.payload.data.ask);
        var deductableusd= subtotl*parseFloat(this.pureequityfee)/100;
        var estusd=subtotl-deductableusd;
        this.sellForm.patchValue({subtotal:subtotl+' USD',estimation:estusd});
      }
    });
  }
}
