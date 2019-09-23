import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { EnterMobileComponent } from './enter-mobile/enter-mobile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { OtpVerifyComponent } from './otp-verifiy/otp-verify.component';
import { AuthRoutes } from "./auth.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { AppSharedModule } from 'src/app/shared/app-shared.module';

@NgModule({
  declarations: [
    EnterMobileComponent,
    SignupComponent,
    LoginComponent,
    OtpVerifyComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    AppSharedModule
  ],
  exports: [],
  providers: [
    CommonService,
    UserService
  ]
})
export class AuthModule { }
