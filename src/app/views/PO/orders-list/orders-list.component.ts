import { Component, OnInit } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { PurchaseOrders, DownloadPO, OrderItemsList } from 'src/app/shared/models/purchase-orders';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit {

  orders: Array<PurchaseOrders | OrderItemsList> = [];
  po: DownloadPO;

  constructor(private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const reqId = this._activatedRoute.snapshot.params;
    this.getPurcahseOrdersList(parseInt(reqId.id));
    this.downloadPOPdf(parseInt(reqId.id));

  }

  getPurcahseOrdersList(orderId: number){
    this._purchaseOrdersService.getPORequest(orderId).then(res => this.orders = res.data);
  }


  downloadPOPdf(pid: number){
    this._purchaseOrdersService.getPOPdfDwonload(pid).then(res => this.po = res.data);
  }

  downloadPO(url: string){
    var win = window.open(url, '_blank');
    win.focus();
  }
}