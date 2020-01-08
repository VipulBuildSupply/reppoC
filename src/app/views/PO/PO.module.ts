import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PORouting } from './PO.routing';
import { SharedMaterialModule } from 'src/app/shared/shared-material.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PoComponent } from './po.component';
import { OrderComponent } from './order/order.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { InitiateDeliveryComponent } from './initiate-delivery/initiate-delivery.component';
import { DeliveryDetailsComponent } from './delivery-details/delivery-details.component';

@NgModule({
  declarations: [
    PoComponent,
    OrderComponent,
    OrderDetailsComponent,
    InitiateDeliveryComponent,
    DeliveryDetailsComponent
  ],
  imports: [
    CommonModule,
    PORouting,
    SharedMaterialModule,
    SharedComponentsModule
  ],
  exports: [],
  providers: [],
})
export class POModule { }