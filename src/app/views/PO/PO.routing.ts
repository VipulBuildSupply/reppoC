import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PoComponent } from './po.component';
import { InitiateDeliveryComponent } from './initiate-delivery/initiate-delivery.component';
import { DeliveryDetailsComponent } from './delivery-details/delivery-details.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders/list/pending',
        component: PoComponent,
        data: { title: 'Pending Orders List' }
      },

      {
        path: 'orders/list/awarded',
        component: PoComponent,
        data: { title: 'Awarded Orders List' }
      },

      {
        path: 'orders/details/pending/:id',
        component: OrderDetailsComponent,
        data: { title: 'Pending Orders List' }
      },

      {
        path: 'orders/details/awarded/:id',
        component: OrderDetailsComponent,
        data: { title: 'Awarded Orders List' }
      },

      {
        path: 'orders/details/awarded/:id/initiate-delivery',
        component: InitiateDeliveryComponent,
        data: { title: 'Initiate Delivery' }
      },

      {
        path: 'orders/details/awarded/:orderId/active-delivery-details/:itemId',
        component: DeliveryDetailsComponent,
        data: { title: 'Delivery Details' }
      },
      {
        path: 'orders/details/awarded/:orderId/past-delivery-details/:itemId',
        component: DeliveryDetailsComponent,
        data: { title: 'Delivery Details' }
      }
    ]    
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PORouting { }