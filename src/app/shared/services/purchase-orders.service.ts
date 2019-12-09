import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';

@Injectable()
export class PurchaseOrdersService {

    constructor(private dataService: DataService) { }

    getSellerPOList() {
        return this.dataService.getRequest(API.GET_PO_LIST).then((res: any) => res);
    }

    getPORequest(reqId) {
        return this.dataService.getRequest(API.GET_PO_REQUEST(reqId)).then((res: any) => res);
    }

    getPOPdfDwonload(pid){
        return this.dataService.getRequest(API.GET_PO_PDF_DOWNLOAD(pid)).then((res: any) => res);
    }
}