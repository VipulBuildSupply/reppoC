import { Routes } from "@angular/router";
import { ActedLeadComponent } from './acted-leads/acted-leads.component';
import { NewLeadComponent } from './new-leads/new-leads.component';

export const LeadDetailsRoutes: Routes = [
    {
        path: "leads-details",
        children: [
            {
                path: "new-lead/:id",
                component: NewLeadComponent,
                data: { title: "New Leads" }
            },
            {
                path: "acted-lead/:id',",
                component: ActedLeadComponent,
                data: { title: "Acted Leads" }
            }
        ]
    }
];
