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
import { IndianCurrency } from './pipes/indianCurrency.pipe';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { NewDatePipe } from './pipes/new-date.pipe';
import { DecimalNumberDirective } from './directive/decimal-numbers.directive';
import { Keyobject } from './pipes/obj-ng-for.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedMaterialModule,
    SharedDirectivesModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  declarations: [
    ...SharedDialogs,
    OtpDirective,
    IndianCurrency,
    CustomDatePipe,
    NewDatePipe,
    DecimalNumberDirective,
    Keyobject
  ],
  exports: [
    ...SharedDialogs,
    SharedComponentsModule,
    SharedMaterialModule,
    OtpDirective,
    SharedDirectivesModule,
    SlickCarouselModule,
    IndianCurrency,
    CustomDatePipe,
    NewDatePipe,
    DecimalNumberDirective,
    Keyobject
  ],
  entryComponents: [
    ...SharedDialogs,
    SnackComponent
  ]
})
export class AppSharedModule { }
