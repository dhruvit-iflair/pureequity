import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule} from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardsRoutes } from './dashboards.routing';
import { ChartistModule} from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { KycComponent } from './kyc/kyc.component';
import { KycadminComponent } from './kycadmin/kycadmin.component';
import { KycAdminComponent } from './kyc/kycadmin.component';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule, 
    ChartsModule,  
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(DashboardsRoutes)
  ],
  declarations: [ Dashboard1Component, Dashboard2Component,KycComponent, KycadminComponent,KycAdminComponent ]
})

export class DashboardsModule {
       
    
}
