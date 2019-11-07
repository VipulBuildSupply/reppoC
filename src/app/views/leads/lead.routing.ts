import { Routes } from "@angular/router";

export const leadRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./leads-details/leads-details.module').then(m => m.LeadDetailsModule),
        data: { title: 'lead-details' }
      },
    ]
  },
];