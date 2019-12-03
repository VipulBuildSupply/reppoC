import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
        data: { title: 'Orders' }
      }
    ]    
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PORouting { }