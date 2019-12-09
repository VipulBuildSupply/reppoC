import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { OrdersComponent } from './orders/orders.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders/details',
        component: OrdersComponent,
        data: { title: 'Orders Details' }
      },

      {
        path: 'orders/list/:id',
        component: OrdersListComponent,
        data: { title: 'Orders List' }
      }
    ]    
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PORouting { }