import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { PoOrders, ActivePastDelivery } from 'src/app/shared/models/purchase-orders';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-delivery-details',
  templateUrl: './delivery-details.component.html'
})
export class DeliveryDetailsComponent implements OnInit {

  orders: PoOrders;
  activeTab: string;
  deliveryType: string;
  deliveryDetails: ActivePastDelivery[];
  itemId: number;
  orderId: number;
  invoiceFileExt: string;
  challanFileExt: string;
  eWayFileExt: string;
  MtcFileExt: string;
  LrFileExt: string;

  constructor(private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute,
    private _commonService: CommonService) { }

  ngOnInit() {
    this.orderId = parseInt(this._activatedRoute.snapshot.params.orderId);
    this.itemId = parseInt(this._activatedRoute.snapshot.params.itemId);

    this.getPurchaseOrdersList(this.orderId);
    this.getAllDeliveryDetails(this.orderId);

    this.deliveryType =  this._activatedRoute.snapshot.url[4].path;

    /**
     * @description Checked the selected url
     */
    this._activatedRoute.url.subscribe(url => {
      this.deliveryType =  url[4].path;
    });
  }

  /**
   * Get all orders list for specific PO id
   */
  getPurchaseOrdersList(orderId: number){
    this._purchaseOrdersService.getPORequest(orderId).then(res => this.orders = res.data);
  }

  getAllDeliveryDetails(orderId){
    this._purchaseOrdersService.getAllTypeDeliveries(orderId).then(res => {

      if(this.deliveryType === 'active-delivery-details'){
        this.deliveryDetails = res.data.activeDeliveries.filter(item => item.id === this.itemId);
        this.documentAttachIds(this.deliveryDetails[0]);
      }

      if(this.deliveryType === 'past-delivery-details'){
        this.deliveryDetails = res.data.pastDeliveries.filter(item => item.id === this.itemId);
        this.documentAttachIds(this.deliveryDetails[0]);
      }

    });
  }

  getDocsDetails(docId: number, type: 'Invoice' | 'EwayBill' | 'Challan' |  'MTC' | 'LR' ){

    if(docId){

      this._commonService.docDownload(docId).then(res => {

        switch (type) {
          case 'Invoice':
            this.deliveryDetails[0].invoiceDocName = res[0].orginalFileName;
            this.deliveryDetails[0].invoiceSignedUrl = res[0].signedUrl;
            this.getFileExtension(res[0].orginalFileName, 'Invoice');
            break;

          case 'EwayBill':
            this.deliveryDetails[0].eWayDocName = res[0].orginalFileName;
            this.deliveryDetails[0].eWaySignedUrl = res[0].signedUrl;
            this.getFileExtension(res[0].orginalFileName, 'EwayBill');
            break;

          case 'Challan':
            this.deliveryDetails[0].challanDocName = res[0].orginalFileName;
            this.deliveryDetails[0].challanSignedUrl = res[0].signedUrl;
            this.getFileExtension(res[0].orginalFileName, 'Challan');
            break;

          case 'MTC':
            this.deliveryDetails[0].materialTestDocName = res[0].orginalFileName;
            this.deliveryDetails[0].materialTestSignedUrl = res[0].signedUrl;
            this.getFileExtension(res[0].orginalFileName, 'MTC');
            break;

          case 'LR':
            this.deliveryDetails[0].lorryReceiptDocName = res[0].orginalFileName;
            this.deliveryDetails[0].lorryReceiptSignedUrl = res[0].signedUrl;
            this.getFileExtension(res[0].orginalFileName, 'LR');
            break;
        
          default:
            break;
        }
      })
    }
  }

  getFileExtension(name, type){
    const [fileName, fileExt] = name.split(".");
    switch(type){
      case 'Invoice':
        this.invoiceFileExt = fileExt;
        break;
      case 'EwayBill':
        this.eWayFileExt = fileExt;
        break;
      case 'Challan':
        this.challanFileExt = fileExt;
        break;
      case 'MTC':
        this.MtcFileExt = fileExt;
        break;
      case 'LR':
        this.LrFileExt = fileExt;
        break;
      default:
        break;
    }
  }

  documentAttachIds(data){
    this.getDocsDetails(data.invoiceAttachId, 'Invoice');
    this.getDocsDetails(data.ewayBillAttachId, 'EwayBill');
    this.getDocsDetails(data.challanAttachId, 'Challan');
    this.getDocsDetails(data.materialTestAttachId, 'MTC');
    this.getDocsDetails(data.lorryReceiptAttachId, 'LR');
  }

  downloadAttachment(url: string){
    var win = window.open(url, '_blank');
    win.focus();
  }

}