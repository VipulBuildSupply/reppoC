import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PoOrders } from 'src/app/shared/models/purchase-orders';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { ItemListComponent } from 'src/app/shared/components/item-list/item-list.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  @Input('orderItems') ordersItems: PoOrders;
  @Input('selectedTab') selectedTab: string;

  constructor() { }

  ngOnInit() {

    // LoggerService.debug(this.selectedTab);
    LoggerService.debug(this.ordersItems);
    
  }

}