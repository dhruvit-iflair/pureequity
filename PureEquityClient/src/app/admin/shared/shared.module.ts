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
    CoinBalanceService
  ],

})
export class SharedModule { }
