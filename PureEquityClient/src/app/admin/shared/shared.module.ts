import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { RoleService } from './services/role.service';
import { UsersService } from "./services/users.service";
import { FirstcapitalizePipe } from './pipes/firstCapitalize.pipe';
import { DashboardService } from './services/dashboard.service';
import { GlobalService } from './services/global.service';
import { TopnavbService } from './topnavb/topnavb.service';
import { FileDropDirective } from "./directives/filedrops.directive";
import { BankdetailsService } from './services/bankdetails.service';
import { CsvService } from './services/csv.service';
import { BitGoService } from "./services/bitgo.service";
import { CoinBalanceService } from './services/coinBalance.service';
import { CoinsService } from './services/coins.service';
import { MoneyService } from './services/money.service';
import { TradeService } from './services/trade.service';
import { InstantOrderBuyService } from './services/instant-order-buy.service';
import { InstantOrderSellService } from './services/instant-order-sell.service';
import { LimitOrderService } from './services/limit-order.service';
import { StopOrderService } from './services/stop-order.service';

import { MarketOrderSellService } from './services/market-order-sell.service';
import { MarketOrderBuyService } from './services/market-order-buy.service';
@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    FirstcapitalizePipe,
    FileDropDirective
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
   ],
  providers: [
    MenuItems,
    RoleService,
    UsersService,
    DashboardService,
    GlobalService,
    TopnavbService,
    BankdetailsService,
    CsvService,
    BitGoService,
    CoinBalanceService,
    CoinsService,
    MoneyService,
    TradeService,
    InstantOrderBuyService,
    InstantOrderSellService,
    LimitOrderService,
    StopOrderService,
    MarketOrderSellService,
    MarketOrderBuyService
  ],

})
export class SharedModule { }
