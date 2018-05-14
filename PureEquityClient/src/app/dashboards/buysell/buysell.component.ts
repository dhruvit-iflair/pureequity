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
    this.availableBalance='154.8524 EUR';
  }
  enablebuybtc(){
    this.enablesellcontainer=false;
    this.enablebuycontainer=true;
  }
  enablesellbtc(){
    this.enablebuycontainer=false;
    this.enablesellcontainer=true;
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
        //sell nu logic implementation baki che..
        var subtotl = parseFloat(this.buysellForm.value.amount)*parseFloat(respdata.payload.data.bid);
        //var subtotal = subtotl * respdata.payload.data.ask;
        var estbtc= subtotal/respdata.payload.data.ask;
        this.buysellForm.patchValue({subtotal:subtotal+' USD',estimation:estbtc});
      }
    });
    //var calculated= this.buysellForm.value.amount*parseFloat(this.pureequityfee)/100;
    //calculation pending for showing values on form.
  }
}
