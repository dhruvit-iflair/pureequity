import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-market-order',
  templateUrl: './market-order.component.html',
  styleUrls: ['./market-order.component.css']
})
export class MarketOrderComponent implements OnInit {
  @Input() availableBalanceBuy:any;
  @Input() availableBalanceSell:any;
  public marketOrderBuyForm : FormGroup;
  public marketOrderSellForm : FormGroup;

  constructor(public fb:FormBuilder) { }

  ngOnInit() {
    this.marketOrderBuyForm = this.fb.group({
      amount : ['',Validators.required],
      buyprice : ['',Validators.required]
    })
    this.marketOrderSellForm = this.fb.group({
      amount : ['',Validators.required],
      sellprice : ['',Validators.required]
    })
  }
  

}
