import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
// import { LeadDetailsComponent } from './leads-details/lead-details.component';
import { LeadListComponent } from './list/lead-list.component';
import { LeadResolver } from './resolver/lead.resolver';
import { LeadDetailsViewComponent } from './details/lead-details.component';
import { DetailsResolver } from './resolver/details.resolver';

export const leadRoutes: Routes = [
    {
        path: '',
        redirectTo: 'new/list',
        pathMatch: 'full'
    },
    // {
    //     path: 'new-lead',
    //     component: LeadDetailsComponent,
    //     data: { title: 'New Leads' }
    // },
    {
        path: 'new/list',
        component: LeadListComponent,
        resolve: { leads: LeadResolver },
        data: { title: 'New Leads' }
    },
    {
        path: 'details/:id',
        component: LeadDetailsViewComponent,
        resolve: { details: DetailsResolver },
        data: { title: 'Lead Details' }
    },
    {
        path: 'acted/details/:id',
        component: LeadDetailsViewComponent,
        resolve: { details: DetailsResolver },
        data: { title: 'Lead Details' }
    },
    {
        path: 'acted/list',
        component: LeadListComponent,
        resolve: { leads: LeadResolver },
        data: { title: 'New Leads' }
    },
    // {
    //     path: 'acted-lead',
    //     component: LeadDetailsComponent,
    //     data: { title: 'Acted Leads' }
    // },
    // {
    //     path: 'new-lead/:id',
    //     component: LeadDetailsComponent,
    //     data: { title: 'New Leads' }
    // },
    // {
    //     path: 'acted-lead/:id',
    //     component: LeadDetailsComponent,
    //     data: { title: 'Acted Leads' }
    // }
];
@NgModule({
    imports: [ RouterModule.forChild(leadRoutes) ],
    exports: [ RouterModule ]
})

export class LeadsRouting { }
