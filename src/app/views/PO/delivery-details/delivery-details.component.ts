import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { PoOrders } from 'src/app/shared/models/purchase-orders';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html'
})
export class DeliveryDetailsComponent implements OnInit {

  orders: PoOrders;
  activeTab: string;

  constructor(private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const reqId = this._activatedRoute.snapshot.params;
    this.getPurchaseOrdersList(parseInt(reqId.id));
  }

  /**
   * Get all orders list for specific PO id
   */
  getPurchaseOrdersList(orderId: number){
    this._purchaseOrdersService.getPORequest(orderId).then(res => this.orders = res.data);
  }

}