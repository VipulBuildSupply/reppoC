import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { leadRoutes } from './lead.routing';
import { LeadDetailsModule } from './leads-details/leads-details.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LeadDetailsModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    SharedComponentsModule,
    RouterModule.forChild(leadRoutes)
  ],
  entryComponents: []
})
export class LeadModule { }
