import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { PORouting } from './PO.routing';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { MarkInTransitComponent } from './mark-in-transit/mark-in-transit.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersListComponent,
    MarkInTransitComponent
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