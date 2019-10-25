import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { DefaultLayoutComponent } from './shared/components/layouts/default-layout/default-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { ProfileLayoutComponent } from './shared/components/layouts/profile-layout/profile-layout.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { PrivacyPolicyComponent } from './views/need-help/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './views/need-help/terms-and-conditions/terms-and-conditions.component';
import { AuthGuardService } from './shared/guards/auth.guard';
import { CatalogueGuardService } from './shared/guards/catalogue.guard';
import { ProfileVerificationComponent } from './views/profile-verification/profile-verification.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/enter-mobile',
    pathMatch: 'full'
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [CatalogueGuardService],
    children: [
      { 
        path: 'home', 
        component: HomeComponent,
        pathMatch: 'full'
      },
      
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
    
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsComponent
      }
    ]
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        children: [
          {
            path: 'open-tile',
            loadChildren: () => import('./views/open-tile/open-tile.module').then(m => m.OpenTileModule),
            data: { title: 'Open-tile' }
          }

        ]
      }
    ]
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuardService, CatalogueGuardService],
    children: [
      {
        path: '',
        children: [
          {
            path: 'profile-verification',
            loadChildren: () => import('./views/profile-verification/profile-verification.module').then(m => m.ProfileVerificationModule),
            data: { title: 'Profile Verification' }
          }

        ]
      }
    ]
  },

  // {
  //   path: '',
  //   component: DefaultLayoutComponent,
  //   canActivate: [CatalogueGuardService, AuthGuardService],
  //   children: [
  //     {
  //       path: 'profile-verification',
  //       component: ProfileVerificationComponent,
  //       data: { title: 'Profile Verification' }
  //     }
  //   ]
  // },

  {
    path: '', 
    component: AuthLayoutComponent,
    //canActivate: [CatalogueGuardService],
    children: [
      { 
        path: 'auth', 
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule),
        data: { title: 'Auth'} 
      }
    ]
  },

  {
    path: '', 
    component: ProfileLayoutComponent,
    canActivate: [AuthGuardService, CatalogueGuardService],
    children: [
      { 
        path: 'user', 
        loadChildren: () => import('./views/user/user.module').then(m => m.UserModule),
        data: { title: 'User'} 
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuardService, CatalogueGuardService],
    children: [
      {
        path: 'catalogue',
        loadChildren: () => import('./views/catalogue/catalogue.module').then(m => m.CatalogueModule),
        data: { title: 'Catalogue', breadcrumb: 'Catalogue'}
      }
    ]
  },

  {
    path: '404',
    component: NotFoundComponent
  },
  
  {
    path: '**',
    redirectTo: '404'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
