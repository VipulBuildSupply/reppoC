import { Routes } from "@angular/router";
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
                path: "acted-lead/:id",
                component: NewLeadComponent,
                data: { title: "Acted Leads" }
            }
        ]
    }
];
