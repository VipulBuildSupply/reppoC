import { Routes } from "@angular/router";

export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile' }
      },
    ]
  },
];