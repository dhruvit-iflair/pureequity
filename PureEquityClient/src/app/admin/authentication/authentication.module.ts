import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatSpinner, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthenticationRoutes } from './authentication.routing';
import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { LoginService } from "../shared/services/login.service";
import { RoleService } from "../shared/services/role.service";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyComponent } from './verify/verify.component';
import { QrotpverificationComponentx } from './qrotpverification/qrotpverification.component';
import { ContactUsComponent } from '../pages/contact-us/contact-us.component';
import { PrivicyPolicyComponent } from '../pages/privicy-policy/privicy-policy.component';
import { TermsConditionsComponent } from '../pages/terms-conditions/terms-conditions.component';

@NgModule({
  imports: [ 
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  declarations: [
    ErrorComponent,
    ForgotComponent,
    LockscreenComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    VerifyComponent,
    QrotpverificationComponentx,
    ContactUsComponent,
    PrivicyPolicyComponent,
    TermsConditionsComponent
  ],
  providers:[
      // Services
      LoginService,
      RoleService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AuthenticationModule {}
