import { Component, OnInit } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { DownloadPo, PoOrders } from 'src/app/shared/models/purchase-orders';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit {

  orders: PoOrders;
  po: DownloadPo;

  addressTypes = {
    'Supplier Billing Address': 'sellerAddress',
    'Delivery Address': 'deliveryAddress',
    'Buyer Billing Address': 'buyerAddress'
  }
  acceptPOStatus: string;
  rejectPOStatus: string;

  constructor(private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const reqId = this._activatedRoute.snapshot.params;
    this.getPurcahseOrdersList(parseInt(reqId.id));
    this.downloadPOPdf(parseInt(reqId.id));
  }

  /**
   * Get all orders list for specific PO id
   */
  getPurcahseOrdersList(orderId: number){
    this._purchaseOrdersService.getPORequest(orderId).then(res => this.orders = res.data);
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
        this.getPurcahseOrdersList(pid);
      });
    }else{
      this._purchaseOrdersService.acceptRejectPO(pid, 'REJECT').then(res => {
        this.rejectPOStatus = res.data.success;
        this.getPurcahseOrdersList(pid);
      });
    }
  }
}