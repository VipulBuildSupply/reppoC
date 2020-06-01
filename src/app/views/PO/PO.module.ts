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
import { MultiItemCheckboxComponent } from './initiate-delivery/multi-item-checkbox/multi-item-checkbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { ShortCloseComponent } from './short-close/short-close.component';
import { ShortCloseResolver } from './short-close/resolver/short-close.resolver';

@NgModule({
  declarations: [
    PoComponent,
    OrderComponent,
    OrderDetailsComponent,
    InitiateDeliveryComponent,
    DeliveryDetailsComponent,
    MultiItemCheckboxComponent,
    ShortCloseComponent
  ],
  imports: [
    CommonModule,
    PORouting,
    SharedMaterialModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule
  ],
  exports: [],
  providers: [ ShortCloseResolver ],
})
export class POModule { }