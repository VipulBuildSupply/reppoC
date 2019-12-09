import { Component, OnInit } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { PurchaseOrders } from 'src/app/shared/models/purchase-orders';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {

  ordersList: PurchaseOrders;

  constructor(private _purchaseOrdersService: PurchaseOrdersService) { }

  ngOnInit() {
  
    this._purchaseOrdersService.getSellerPOList().then(res => this.ordersList = res.data);
  }

}