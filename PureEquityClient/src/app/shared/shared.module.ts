import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { RoleService } from './services/role.service';
import { UsersService } from "./services/users.service";
import { FirstcapitalizePipe } from './pipes/firstCapitalize.pipe';
@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    FirstcapitalizePipe
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
   ],
  providers: [ MenuItems, RoleService, UsersService],

})
export class SharedModule { }
