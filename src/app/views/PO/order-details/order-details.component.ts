import { Component, OnInit, Input } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { DownloadPo, PoOrders, AllDeliveries, ActivePastDelivery, DispatchSchedules } from 'src/app/shared/models/purchase-orders';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit {

  orders: PoOrders;
  po: DownloadPo;
  acceptPOStatus: string;
  rejectPOStatus: string;
  activeTab: string;
  // activeDeliveries: ActivePastDelivery[];
  // pastDeliveries: ActivePastDelivery[];
  // dispatchSchedules: DispatchSchedules[];
  allDeliveries: AllDeliveries;

  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;

  addressTypes = {
    'Supplier Billing Address': 'sellerAddress',
    'Delivery Address': 'deliveryAddress',
    'Buyer Billing Address': 'buyerAddress'
  }

  constructor(private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const reqId = this._activatedRoute.snapshot.params;
    this.getPurchaseOrdersList(parseInt(reqId.id));
    this.downloadPOPdf(parseInt(reqId.id));
    this.getAllDeliveryDetails(parseInt(reqId.id));

    this.activeTab =  this._activatedRoute.snapshot.url[2].path;
 
    /**
     * @description Checked the selected url
     */
    this._activatedRoute.url.subscribe(url => {
      this.activeTab =  url[2].path;
    });
  }

  /**
   * Get all orders list for specific PO id
   */
  getPurchaseOrdersList(orderId: number){
    this._purchaseOrdersService.getPORequest(orderId).then(res => {
      this.orders = res.data;
      LoggerService.debug(this.orders);
    });
  }

  /**
   * Get the PO download URL 
   */
  downloadPOPdf(pid: number){
    this._purchaseOrdersService.getPOPdfDownload(pid).then(res => this.po = res.data);
  }

  /**
   * Downlaod the PO for specific purchase order
   */
  downloadPO(url: string){
    var win = window.open(url, '_blank');
    win.focus();
  }

  acceptRejectPO(pid, btnStatus){
    if(btnStatus === 'CONFIRM'){
      this._purchaseOrdersService.acceptRejectPO(pid, 'CONFIRM').then(res => {
        this.acceptPOStatus = res.data.success;
        this.getPurchaseOrdersList(pid);
      });
    }else{
      this._purchaseOrdersService.acceptRejectPO(pid, 'REJECT').then(res => {
        this.rejectPOStatus = res.data.success;
        this.getPurchaseOrdersList(pid);
        
      });
    }
  }


  getAllDeliveryDetails(orderId){
    this._purchaseOrdersService.getAllTypeDeliveries(orderId).then(res => {
      this.allDeliveries = res.data;
      LoggerService.debug(res.data);
    });
  }
}