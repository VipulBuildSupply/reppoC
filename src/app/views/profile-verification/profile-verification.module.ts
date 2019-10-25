import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileVerificationRouting } from './profile-verification.routing';
import { ProfileVerificationComponent } from './profile-verification.component';

@NgModule({
  declarations: [
    ProfileVerificationComponent
  ],
  imports: [
    CommonModule,
    ProfileVerificationRouting
  ],
  exports: [],
  providers: [],
})
export class ProfileVerificationModule { }