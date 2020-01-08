import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileRoutes } from './profile.routing';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { BillingAddressComponent } from './billing-address/billing-address.component';
import { WarehouseAddressComponent } from './warehouse-address/warehouse-address.component';
import { OtpComponent } from './reset-password/otp/otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordResolver } from './reset-password/resolver/reset-password.resolver';
import { ChangePasswordComponent } from './reset-password/change-Password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { ProfileResolver } from './personal-profile/resolver/profile.resolver';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { AddAddressComponent } from './address-profile/add-address/add-address.component';
import { AddressProfileComponent } from './address-profile/address-profile.component';
import { AddressResolver } from './address-profile/resolver/address.resolver';
import { StateResolver } from './address-profile/add-address/resolver/states.resolver';
import { AddBankDetailsComponent } from './bank-details/add-bank-details/add-bank-details.component';
import { BankDetailsResolver } from './bank-details/resolver/bank-details.resolver';
import { MultiSelectChipComponent } from './shared/multi-select/multi-select.component';
import { BusinessDetailsResolver } from './business-details/resolver/business-details.resolver';
import { ReferenceComponent } from './reference/reference.component';
@NgModule({
  declarations: [
    PersonalProfileComponent,
    ResetPasswordComponent,
    OtpComponent,
    BusinessDetailsComponent,
    BillingAddressComponent,
    WarehouseAddressComponent,
    ChangePasswordComponent,
    BankDetailsComponent,
    AddressProfileComponent,
    AddBankDetailsComponent,
    AddAddressComponent,
    MultiSelectChipComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    FormsModule,
    AppSharedModule,
    ReactiveFormsModule
  ],
  providers: [
    ProfileResolver,
    ResetPasswordResolver,
    AddressResolver,
    StateResolver,
    BankDetailsResolver,
    ReactiveFormsModule,
    BusinessDetailsResolver
  ],
  entryComponents : []
})
export class ProfileModule { }
