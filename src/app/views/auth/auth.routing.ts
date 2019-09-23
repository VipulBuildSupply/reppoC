import { Routes } from "@angular/router";
import { EnterMobileComponent } from './enter-mobile/enter-mobile.component';
import { OtpVerifyComponent } from './otp-verifiy/otp-verify.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const AuthRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "enter-mobile",
        component: EnterMobileComponent,
        data: { title: "Enter Mobile Number" }
      },
      {
        path: "otp-verify",
        component: OtpVerifyComponent,
        data: { title: "Verify OTP" }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Forgot Password" }
      },
      {
        path: "login",
        component: LoginComponent,
        data: { title: "Login" }
      },
      {
        path: "signup",
        component: SignupComponent,
        data: { title: "Signup" }
      },
    ]
  }
];