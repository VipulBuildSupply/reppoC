import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { NewLeadComponent } from './leads-details/new-leads/new-leads.component';
// import { LeadSidebarComponent } from './leads-details/lead-sidebar/lead-sidebar.component';
// import { LeadDetailsComponent } from './leads-details/lead-details.component';
import { LeadsRouting } from './leads.routing';
import { LeadListItemComponent } from 'src/app/shared/components/lead-list-item/lead-list-item.component';
import { LeadListComponent } from './list/lead-list.component';
import { SkuComponent } from 'src/app/shared/components/sku/sku.component';
import { LeadResolver } from './resolver/lead.resolver';
import { LeadDetailsViewComponent } from './details/lead-details.component';
import { DetailsResolver } from './resolver/details.resolver';
import { ChooseAddressDialogComponent } from 'src/app/shared/dialogs/choose-address/choose-address';
import { AddressService } from 'src/app/shared/services/address.service';
import { VerifiedUserGuard } from 'src/app/shared/guards/verified-user.guard';

@NgModule({
  declarations: [
    // NewLeadComponent,
    // LeadSidebarComponent,
    // LeadDetailsComponent,
    LeadListItemComponent,
    LeadListComponent,
    SkuComponent,
    LeadDetailsViewComponent,
    ChooseAddressDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppSharedModule,
    ReactiveFormsModule,
    LeadsRouting
  ],
  providers: [ LeadResolver, DetailsResolver, AddressService ],
  entryComponents: [ ChooseAddressDialogComponent ]
})


export class LeadsModule { }
