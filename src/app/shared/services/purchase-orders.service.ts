import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';

@Injectable()
export class PurchaseOrdersService {

    constructor(private _dataService: DataService) { }

    getSellerPOList() {
        return this._dataService.getRequest(API.GET_PO_LIST).then((res: any) => res);
    }

    getSellerPOListByStatus() {
        return this._dataService.getRequest(API.GET_PO_LIST_BY_STATUS).then((res: any) => res);
    }

    getPORequest(reqId) {
        return this._dataService.getRequest(API.GET_PO_REQUEST(reqId)).then((res: any) => res);
    }

    getPOPdfDownload(pid) {
        return this._dataService.getRequest(API.GET_PO_PDF_DOWNLOAD(pid)).then((res: any) => res);
    }

    acceptRejectPO(pid, status) {
        return this._dataService.sendPutRequest(API.PO_ACCEPT_REJECT(pid, status), null).then((res: any) => res);
    }

    getItemsList(oid) {
        return this._dataService.getRequest(API.GET_PO_ITEMS_LIST(oid)).then((res: any) => res);
    }

    sendDeliveryRequest(orderId, data) {
        return this._dataService.sendPostRequest(API.INITIATE_DELIVERY_REQUEST(orderId), data).then((res: any) => res);
    }

    getAllTypeDeliveries(orderId) {
        return this._dataService.getRequest(API.INITIATE_DELIVERY_REQUEST(orderId)).then((res: any) => res);
    }

    getPOPymtSmryRqst(orderId) {
        return this._dataService.getRequest(API.GET_PO_PAYMENT_SUMMARY(orderId)).then((res: any) => res);
    }

    setShortCloseData(orderId, data) {
        return this._dataService.sendPutRequest(API.PUT_SHORTCLOSE_REQUEST(orderId), data).then(res => res.data)
    }

    initiatePaymentRequest(data) {
        return this._dataService.sendPostRequest(API.INITIATE_PAYMENT_REQUEST, data).then((res: any) => res);
    }

    updateDeliveryTotal(id, data) {
        return this._dataService.sendPostRequest(API.PO_TOTAL(id), data).then((res: any) => res.data);
    }

}