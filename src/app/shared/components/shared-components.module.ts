import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../shared-material.module';
import { HeaderSharedModule } from '../header/header-shared.module';
import { FooterSharedModule } from '../footer/footer-shared.module';
import { ProfileSidebarComponent } from './profile-sidebar/profile-sidebar.component';
import { SnackComponent } from './snack/snack.component';
import { RouterModule } from '@angular/router';
import { ProfileVerifyComponent } from '../dialogs/profile-verify/profile-verify.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddressComponent } from './address/address.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { BankDetailsShowComponent } from './bank-details-show/bank-details-show.component';
// import { LeadSidebarComponent } from '../../views/leads/leads-details/lead-sidebar/lead-sidebar.component';
import { SharedDirectivesModule } from '../directive/shared-directives.module';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { SubFilterComponent } from './sub-filter/sub-filter.component';
import { UploadComponent } from './upload/upload.component';
import { ItemListComponent } from './item-list/item-list.component';


const components = [
  ProfileSidebarComponent,
  SnackComponent,
  AddressComponent,
  AddressFormComponent,
  BankDetailsShowComponent,
  ProfileSidebarComponent,
  SnackComponent,
  ProfileVerifyComponent,
  // LeadSidebarComponent,
  SideNavigationComponent,
  SubFilterComponent,
  UploadComponent,
  ItemListComponent
]

@NgModule({
  declarations: components,

  imports: [
    CommonModule,
    SharedMaterialModule,
    HeaderSharedModule,
    FooterSharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedDirectivesModule
  ],
  exports: components,
  entryComponents: [
    ProfileVerifyComponent
  ]
})
export class SharedComponentsModule { }
