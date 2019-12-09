import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderSharedModule } from './shared/header/header-shared.module';
import { FooterSharedModule } from './shared/footer/footer-shared.module';
import { HomeComponent } from './views/home/home.component';
import { AppSharedModule } from './shared/app-shared.module';
import { DefaultLayoutComponent } from './shared/components/layouts/default-layout/default-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { ProfileLayoutComponent } from './shared/components/layouts/profile-layout/profile-layout.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { CommonService } from './shared/services/common.service';
import { TokenService } from './shared/services/token.service';
import { SigninSignupService } from './shared/services/signin-signup.service';
import { UserService } from './shared/services/user.service';
import { NotificationService } from './shared/services/notification-service';
import { SnotifyService, ToastDefaults } from 'ng-snotify';
import { HttpClientModule } from '@angular/common/http';
import { TermsAndConditionsComponent } from './views/need-help/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './views/need-help/privacy-policy/privacy-policy.component';
import { HttpInterceptorProviders } from './shared/http-interceptors/http-interceptor-providers'; 
import { OpenTileModule } from './views/open-tile/open-tile.module';
import { CategoryService } from './shared/services/category.service';
import { AuthGuardService } from './shared/guards/auth.guard';
import { CatalogueGuardService } from './shared/guards/catalogue.guard';
import { LeadLayoutComponent } from './shared/components/layouts/lead-layout/lead-layout.component';
import { LeadsService } from './shared/services/leads.service';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { PurchaseOrdersService } from './shared/services/purchase-orders.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DefaultLayoutComponent,
    AuthLayoutComponent,
    ProfileLayoutComponent,
    NotFoundComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    LeadLayoutComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderSharedModule,
    FooterSharedModule,
    AppSharedModule,
    HttpClientModule,
    OpenTileModule,
    BrowserAnimationsModule,
  ],
  providers: [
    CommonService,
    TokenService,
    SigninSignupService,
    UserService,
    NotificationService,
    SnotifyService,
    {
      provide: 'SnotifyToastConfig',
      useValue: ToastDefaults
    },
    HttpInterceptorProviders,
    CategoryService,
    AuthGuardService,
    CatalogueGuardService,
    LeadsService,
    PurchaseOrdersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
