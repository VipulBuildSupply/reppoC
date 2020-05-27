import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { ProfileVerificationComponent } from './profile-verification.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':status',
        component: ProfileVerificationComponent,
        data: { title: 'Profile Verification' }
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class ProfileVerificationRouting { }