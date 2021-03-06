import { Routes } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyComponent } from './verify/verify.component';
import { QrotpverificationComponentx } from './qrotpverification/qrotpverification.component';
import { ContactUsComponent } from '../pages/contact-us/contact-us.component';
import { PrivicyPolicyComponent } from '../pages/privicy-policy/privicy-policy.component';
import { TermsConditionsComponent } from '../pages/terms-conditions/terms-conditions.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '404',
      component: ErrorComponent
    },
    {
      path: 'contact',
      component: ContactUsComponent
    },{
      path: 'policy',
      component: PrivicyPolicyComponent
    },{
      path: 't&c',
      component: TermsConditionsComponent
    }, {
      path: 'forgot',
      component: ForgotComponent
    }, {
      path: 'reset',
      component: ResetPasswordComponent
    }, {
      path: 'verify',
      component: VerifyComponent
    }, {
      path: 'lockscreen',
      component: LockscreenComponent
    }, {
      path: 'login',
      component: LoginComponent
    }, {
      path: 'register',
      component: RegisterComponent
    }, {
      path: 'verification',
      component: QrotpverificationComponentx
    }]
  }
];
