import "hammerjs";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardsRoutes } from "./dashboards.routing";
import { ChartistModule } from "ng-chartist";
import { ChartsModule } from "ng2-charts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { FileUploadModule } from "ng2-file-upload/ng2-file-upload";
import { CKEditorModule } from "ngx-ckeditor";

import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
import { KycComponent } from "./kyc/kyc.component";
import { KycadminComponent } from "./kycadmin/kycadmin.component";
import { KycAdminComponent } from "./kyc/kycadmin.component";
import { BankdetailsComponent } from "./bankdetails/bankdetails.component";
import { QrotpverificationComponent } from "./qrotpverification/qrotpverification.component";
import { DashboardService } from "../shared/services/dashboard.service";
import { ChangePasswordComponent } from "../pages/change-password/change-password.component";
import { LoginService } from "../shared/services/login.service";
import { MailerComponent } from "./mailer/mailer.component";
import { MaillistComponent } from "./mailer/maillist/maillist.component";
import { RolesComponent } from "./roles/roles.component";
import { RoleComponent } from "./roles/role/role.component";
import { BuysellComponent } from "./buysell/buysell.component";
import { NgxPayPalModule } from "ngx-paypal";
import { BankComponent } from "./bank/bank.component";
import { DepositComponent } from "./deposit/deposit.component";
import { WithdrawalComponent } from "./withdrawal/withdrawal.component";
import { ReportsComponent } from "../pages/reports/reports.component";
import { ReviewTransactionsComponent } from "../pages/review-transactions/review-transactions.component";
import { LimitOrderComponent } from "./buysell/limit-order/limit-order.component";
import { MarketOrderComponent } from "./buysell/market-order/market-order.component";
import { StopOrderComponent } from "./buysell/stop-order/stop-order.component";

// import { UsersRouting } from '../pages/users/users-routing.module';
import { UsersComponent } from "../pages/users/users/users.component";
import { EditUserComponent } from "../pages/users/edit-user/edit-user.component";
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef
} from "@angular/material/dialog";

import { FirstcapitalizePipe } from "../shared/pipes/firstCapitalize.pipe";
import { PersonalAddressComponent } from "../pages/users/edit-user/user-personal-details/personal-address/personal-address.component";
import { PersonalDetailsComponent } from "../pages/users/edit-user/user-personal-details/personal-details/personal-details.component";
import { UserDetailsComponent } from "../pages/users/edit-user/user-details/user-details.component";
import { UserPersonalDetailsComponent } from "../pages/users/edit-user/user-personal-details/user-personal-details.component";
import { ProfileComponent } from "../pages/users/profile/profile.component";
import { BalanceManagementComponent } from './balance-management/balance-management.component';
import { UsersService } from "../shared/services/users.service";
import { KycdetailsComponent } from './kycdetails/kycdetails.component';
import { NewUserComponent } from '../pages/users/new-user/new-user.component';

@NgModule({
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    ChartistModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DashboardsRoutes),
    NgxChartsModule,
    FileUploadModule,
    CKEditorModule,
    NgxPayPalModule,
    MatDialogModule
  ],
  declarations: [
    Dashboard1Component,
    Dashboard2Component,
    KycComponent,
    KycadminComponent,
    KycAdminComponent,
    BankdetailsComponent,
    QrotpverificationComponent,
    ChangePasswordComponent,
    MailerComponent,
    MaillistComponent,
    RolesComponent,
    RoleComponent,
    BuysellComponent,
    BankComponent,
    DepositComponent,
    WithdrawalComponent,
    ReportsComponent,
    ReviewTransactionsComponent,
    LimitOrderComponent,
    MarketOrderComponent,
    StopOrderComponent,
    UsersComponent,
    EditUserComponent,
    PersonalAddressComponent,
    PersonalDetailsComponent,
    UserDetailsComponent,
    UserPersonalDetailsComponent,
    ProfileComponent,
    BalanceManagementComponent,
    KycdetailsComponent,
    NewUserComponent
  ],
  providers: [DashboardService, LoginService, UsersService],
  entryComponents:[EditUserComponent,ProfileComponent, KycdetailsComponent, NewUserComponent]
})
export class DashboardsModule {}
