import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';

@Injectable()
export class PurchaseOrdersService {

    constructor(private _dataService: DataService) { }

    getSellerPOList() {
        return this._dataService.getRequest(API.GET_PO_LIST).then((res: any) => res);
    }

    getPORequest(reqId) {
        return this._dataService.getRequest(API.GET_PO_REQUEST(reqId)).then((res: any) => res);
    }

    getPOPdfDownload(pid){
        return this._dataService.getRequest(API.GET_PO_PDF_DOWNLOAD(pid)).then((res: any) => res);
    }

    acceptRejectPO(pid, status){
        return this._dataService.sendPutRequest(API.PO_ACCEPT_REJECT(pid, status), null).then((res: any) => res);
    }
}