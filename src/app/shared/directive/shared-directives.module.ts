import { OnlyNumberDirective } from './number-only.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const directives = [ OnlyNumberDirective ]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: directives,
  exports: directives
})
export class SharedDirectivesModule { }