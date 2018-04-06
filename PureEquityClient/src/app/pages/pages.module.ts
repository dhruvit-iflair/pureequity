import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { MaterialModule } from './material/material.module';


@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
  ],
  declarations: []
})
export class PagesModule { }
