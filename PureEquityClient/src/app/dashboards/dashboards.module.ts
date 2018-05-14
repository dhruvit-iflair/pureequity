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
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CKEditorModule } from 'ngx-ckeditor';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { KycComponent } from './kyc/kyc.component';
import { KycadminComponent } from './kycadmin/kycadmin.component';
import { KycAdminComponent } from './kyc/kycadmin.component';
import { BankdetailsComponent } from './bankdetails/bankdetails.component';
import { QrotpverificationComponent } from './qrotpverification/qrotpverification.component';
import { DashboardService } from '../shared/services/dashboard.service';
import { ChangePasswordComponent } from "../pages/change-password/change-password.component";
import { LoginService } from '../shared/services/login.service';
import { MailerComponent } from './mailer/mailer.component';
import { MaillistComponent } from './mailer/maillist/maillist.component';
import { RolesComponent } from './roles/roles.component';
import { RoleComponent } from './roles/role/role.component';
import { BuysellComponent } from './buysell/buysell.component';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule, 
    ChartsModule,  
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(DashboardsRoutes),
    NgxChartsModule,
    CKEditorModule,
    NgxPayPalModule
  ],
  declarations: [ Dashboard1Component, Dashboard2Component,KycComponent, KycadminComponent,KycAdminComponent, BankdetailsComponent,QrotpverificationComponent, ChangePasswordComponent, MailerComponent, MaillistComponent, RolesComponent, RoleComponent, BuysellComponent ],
  providers:[
    DashboardService,
    LoginService
  ]

})

export class DashboardsModule {
       
    
}
