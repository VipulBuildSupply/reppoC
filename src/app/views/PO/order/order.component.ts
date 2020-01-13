import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PoOrders } from 'src/app/shared/models/purchase-orders';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  @Input('orderItems') ordersItems: PoOrders;
  @Input('selectedTab') selectedTab: string;

  constructor() { }

  ngOnInit() {
  }

}