import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from './components/shared-components.module';
import { SharedMaterialModule } from './shared-material.module';
import { SnackComponent } from './components/snack/snack.component';
import { OtpDirective } from './directive/otp.directive';
import { SharedDialogs } from './dialogs/shared-dialogs';
import { SharedDirectivesModule } from './directive/shared-directives.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [
    ...SharedDialogs,
    OtpDirective
  ],
  exports: [
    ...SharedDialogs,
    SharedComponentsModule,
    SharedMaterialModule,
    OtpDirective,
    SharedDirectivesModule,
    SlickCarouselModule
  ],
  entryComponents: [
    ...SharedDialogs,
    SnackComponent
  ]
})
export class AppSharedModule { }
