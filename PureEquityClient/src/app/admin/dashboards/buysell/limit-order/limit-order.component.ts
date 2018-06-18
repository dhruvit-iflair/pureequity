import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-limit-order',
  templateUrl: './limit-order.component.html',
  styleUrls: ['./limit-order.component.css']
})
export class LimitOrderComponent implements OnInit {
  public limitOrderBuyForm : FormGroup;
  public limitOrderSellForm : FormGroup;
  @Input() availableBalanceBuy:any;
  @Input() availableBalanceSell:any;
  @Input() tradeCoin:any;
  
  constructor(public fb:FormBuilder) { }

  ngOnInit() {
    this.limitOrderBuyForm = this.fb.group({
      amount : ['',Validators.required],
      buyprice : ['',Validators.required]
    })
    this.limitOrderSellForm = this.fb.group({
      amount : ['',Validators.required],
      sellprice : ['',Validators.required]
    })
  }

}

