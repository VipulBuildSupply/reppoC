import { Component, OnInit, Input } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { DownloadPo, PoOrders, AllDeliveries, ActivePastDelivery, DispatchSchedules, PoSummary } from 'src/app/shared/models/purchase-orders';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatDialog } from '@angular/material';
import { CustomConfirmationComponent } from 'src/app/shared/dialogs/custom-confirmation/custom-confirmation.component';

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
  allDeliveries: AllDeliveries;
  activeDelivery: ActivePastDelivery[];
  pastDelivery: ActivePastDelivery[];
  dispatchSchedules: DispatchSchedules[];
  poSummary: PoSummary;
  isShortClose: boolean = true;

  paymentLable = 'View More Details';
  // isShortClose: boolean;
  isPayReq: boolean;

  @Input() collapsedHeight: string;
  @Input() expandedHeight: string;

  addressTypes = {
    'Supplier Billing Address': 'sellerAddress',
    'Delivery Address': 'deliveryAddress',
    'Buyer Billing Address': 'buyerAddress'
  }

  constructor(
    private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialog: MatDialog) { }

  ngOnInit() {
    const reqId = this._activatedRoute.snapshot.params;
    this.getPurchaseOrdersList(parseInt(reqId.id));
    this.downloadPOPdf(parseInt(reqId.id));
    this.getAllDeliveryDetails(parseInt(reqId.id));
    this.getPoSummary(parseInt(reqId.id));

    this.activeTab = this._activatedRoute.snapshot.url[2].path;

    /**
     * @description Checked the selected url
     */
    this._activatedRoute.url.subscribe(url => {
      this.activeTab = url[2].path;
    });
  }

  /**
   * Get all orders list for specific PO id
   */
  getPurchaseOrdersList(orderId: number) {
    this._purchaseOrdersService.getPORequest(orderId).then(res => {
      this.orders = res.data;
      let stcd = this.orders.purchaseOrder.statusCd;
      if (stcd === "sellerpo.ops.shortclose" || stcd === "sellerpo.ops.shortclose.confirm" || stcd == 'sellerpo.ops.shortclose.request' || stcd === "sellerpo.seller.shortclose" || stcd === "sellerpo.seller.shortclose.confirm" || stcd == 'sellerpo.seller.shortclose.request') {
        this.isShortClose = false;
      }
      // this.isShortClose = this.orders.orderItemList.some(itm => {
      //   if (itm.deliverySummary.maxRaiseAllowQty) {
      //     return true;
      //   }
      // });
    });
  }

  /**
   * Get the PO download URL
   */
  downloadPOPdf(pid: number) {
    this._purchaseOrdersService.getPOPdfDownload(pid).then(res => this.po = res.data);
  }

  /**
   * Downlaod the PO for specific purchase order
   */
  downloadPO(url: string) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  acceptRejectPO(pid, btnStatus) {
    if (btnStatus === 'CONFIRM') {
      this._purchaseOrdersService.acceptRejectPO(pid, 'CONFIRM').then(res => {
        this.acceptPOStatus = res.data.success;
        this.getPurchaseOrdersList(pid);
      });
    } else {
      this._purchaseOrdersService.acceptRejectPO(pid, 'REJECT').then(res => {
        this.rejectPOStatus = res.data.success;
        this.getPurchaseOrdersList(pid);
      });
    }
  }

  getPoSummary(orderId) {
    this._purchaseOrdersService.getPOPymtSmryRqst(orderId).then(res => {
      this.poSummary = res.data;
    });
  }

  labelDataToggle() {
    this.paymentLable = this.paymentLable === 'View More Details' ? 'View Less Details' : 'View More Details';
  }

  getUploadedDocs(id: number) {
    return this.commonService.docDownload(id).then(data => {
      // this.orders.purchaseOrder.termCondition = data;
      return data;
    });
  }

  showAttachments(attachId) {
    this.getUploadedDocs(attachId).then(data => {
      this.openAttachmentPopup({ title: 'Attachments', msg: '', docs: data });
    });
  }

  openAttachmentPopup({ title, msg, docs }) {
    const termsPopup = this.dialog.open(CustomConfirmationComponent, {
      data: { title, msg, showCloseButton: true, payload: { hideBtns: true, docs } },
      panelClass: 'custom-popup-switch',
    });
  }


  getAllDeliveryDetails(orderId) {
    this._purchaseOrdersService.getAllTypeDeliveries(orderId).then(res => {
      this.allDeliveries = res.data;
      this.activeDelivery = res.data.activeDeliveries;
      this.pastDelivery = res.data.pastDeliveries;
      this.dispatchSchedules = res.data.dispatchSchedules;
    });
  }

  initiatPayment() {
    this.isPayReq = true;
  }

  getClosePayReqBlock() {
    this.isPayReq = false;
  }

  getStatusColor(statusCd) {
    let colname = '';
    if (statusCd == 'payment.sts.submit') {
      colname = 'green';
    } else {
      colname = 'yellow';
    }
    return colname;
  }

}
