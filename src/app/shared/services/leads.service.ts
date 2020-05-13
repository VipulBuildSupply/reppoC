import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';
import { Subject } from 'rxjs';

@Injectable()

export class LeadsService {

    hasNewLeads$ = new Subject<boolean>();

    constructor(
        private dataService: DataService
    ) { }

    getLeads(isActed = '') {
        // old api url API.GET_NEW_LEADS
        return this.dataService.getRequest(API.GET_RFQ_LIST + (isActed ? `?statusList=${isActed}` : '')).then((res: any) => {
            return res.data;
        });
    }

    getLeadDetails(id: number) {
        return this.dataService.getRequest(API.GET_RFQ_DETAIL(id)).then(res => res.data);
    }

    getNewLeads() {
        return this.dataService.getRequest(API.GET_NEW_LEADS).then((res: any) => {
            this.hasNewLeads$.next(!!res.data.length);
            return res;
        });
    }

    getActedLeads() {
        return this.dataService.getRequest(API.GET_ACTED_LEADS).then((res: any) => res);
    }

    saveLeadAsBookmark(skuId, Status) {
        return this.dataService.sendPutRequest(API.ADD_BOOKMARK_SAVE_LEADS(skuId, Status), null).then(res => res);
    }

    DismissLead(skuId, Status) {
        return this.dataService.sendPutRequest(API.ADD_BOOKMARK_SAVE_LEADS(skuId, Status), null).then(res => res);
    }

    getLeadObj(leadId) {
        return this.dataService.getRequest(API.GET_LEAD_OBJ(leadId)).then((res: any) => res);
    }

    sendQuoteToAllWarehouse(data, leadID) {
        return this.dataService.sendPostRequest(API.QUOTE_SUBMIT_ALL_WAREHOUSE(leadID), data).then(res => res);
    }
    showPaymentTerms() {
        return this.dataService.getRequest(API.GET_PAYMENT_TERMS).then((res: any) => res);
    }

    getSequenceId() {
        return this.dataService.getRequest(API.UNIQUE_ID).then(res => res.data);
    }

    docUpload(data) {
        return this.dataService.sendPostRequest(API.UPLOAD_DOC, data).then(res => res)
    }

    freightTerms() {
        return this.dataService.getRequest(API.GET_FREIGHT_TERMS).then(res => res.data);
    }

    submitRfq(sellerRfqId, data) {
        return this.dataService.sendPostRequest(API.RFQ_SUBMIT(sellerRfqId), data).then(res => res.data);
    }
}