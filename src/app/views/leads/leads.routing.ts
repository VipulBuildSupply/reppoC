import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { LeadDetailsComponent } from './leads-details/lead-details.component';

export const leadRoutes: Routes = [
    {
        path: "new-lead",
        component: LeadDetailsComponent,
        data: { title: "New Leads" }
    },
    {
        path: "acted-lead",
        component: LeadDetailsComponent,
        data: { title: "Acted Leads" }
    },
    {
        path: "new-lead/:id",
        component: LeadDetailsComponent,
        data: { title: "New Leads" }
    },
    {
        path: "acted-lead/:id",
        component: LeadDetailsComponent,
        data: { title: "Acted Leads" }
    }
];

@NgModule({
    imports: [RouterModule.forChild(leadRoutes)],
    exports: [RouterModule]
})

export class LeadsRouting{}