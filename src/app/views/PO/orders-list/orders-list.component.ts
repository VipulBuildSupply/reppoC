import { Component, OnInit } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { PurchaseOrders } from 'src/app/shared/models/purchase-orders';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit {

  orders: any;
  po: any;

  constructor(private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const reqId = this._activatedRoute.snapshot.params;
    this.getPurcahseOrdersList(parseInt(reqId.id));
    this.downloadPOPdf(parseInt(reqId.id));

  }

  getPurcahseOrdersList(orderId){
    this._purchaseOrdersService.getPORequest(parseInt(orderId)).then(res => this.orders = res.data);
  }


  downloadPOPdf(pid){
    this._purchaseOrdersService.getPOPdfDwonload((pid)).then(res => this.po = res.data);
  }

  downloadPO(url){
    var win = window.open(url, '_blank');
    win.focus();
  }
}