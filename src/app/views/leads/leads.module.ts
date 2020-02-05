import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewLeadComponent } from './leads-details/new-leads/new-leads.component';
import { LeadSidebarComponent } from './leads-details/lead-sidebar/lead-sidebar.component';
import { LeadDetailsComponent } from './leads-details/lead-details.component';
import { LeadsRouting } from './leads.routing';

@NgModule({
  declarations: [
    NewLeadComponent,
    LeadSidebarComponent,
    LeadDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppSharedModule,
    ReactiveFormsModule,
    LeadsRouting
  ],
  providers: [],
  entryComponents: []
})

export class LeadsModule { }