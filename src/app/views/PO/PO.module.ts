import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { PORouting } from './PO.routing';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';

@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    PORouting,
    SharedMaterialModule
  ],
  exports: [],
  providers: [],
})
export class POModule { }