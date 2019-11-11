import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeadDetailsRoutes } from './lead-details.routing';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewLeadComponent } from './new-leads/new-leads.component';
@NgModule({
  declarations: [
    NewLeadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LeadDetailsRoutes),
    FormsModule,
    AppSharedModule,
    ReactiveFormsModule
  ],
  providers: [],
  entryComponents: []
})
export class LeadDetailsModule { }
