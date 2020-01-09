import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { PurchaseOrders, PoOrders, PoCategory } from 'src/app/shared/models/purchase-orders';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html'
})
export class PoComponent implements OnInit {

  activeTab:string; // 'pending' | 'awarded';
  orderItemsList: PurchaseOrders;
  pendingOrderItemsList: PoCategory;
  awardedOrderItemsList: PoCategory;
  subscriptions: Subscription[] = [];

  constructor(private _activatedRoute: ActivatedRoute,
    private _purchaseOrdersService: PurchaseOrdersService) { }

  ngOnInit() {

    this.activeTab =  this._activatedRoute.snapshot.url[2].path;
 
    /**
     * @description Checked the selected url
     */
    this._activatedRoute.url.subscribe(url => {
      this.activeTab =  url[2].path;
    });

    // this._purchaseOrdersService.getSellerPOList().then(res => this.orderItemsList = res.data);

    this.getAllOrdersList();
  }

  /**
   * @description Get all pending and awarded POs list
   */
  getAllOrdersList(){
    this._purchaseOrdersService.getSellerPOListByStatus().then(res => {
      this.pendingOrderItemsList = res.data.pending;
      this.awardedOrderItemsList = res.data.awarded;
    })
  }

  /**
   * @description Unsubscribe all of subscription
   */
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}