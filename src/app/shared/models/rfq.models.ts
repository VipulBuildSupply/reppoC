import { AddressModel } from './address';
import { FormGroup, FormArray } from '@angular/forms';
import { DocumentModel } from './delivery-request';

export interface RfqItem {

    freightTerm: string;
    freightTermCd: string;
    items: RfqSku[];
    paymentTerm: string;
    paymentTermCd: string;
    rfq: RfqDetails;
    validEndDt: string;


}



export interface RfqDetails {
    documents: any[];
    expireDt: string;
    expired: boolean;
    id: number;
    note: string;
    opsAttachId: number;
    paymentTerm: string;
    paymentTermId: number;
    pid: number;
    status: string;
    statusCd: string;

    createDt: string;
}

export interface RfqSku {
    note: string;
    sellerRfqItem: RFQItemSkuDetails;
    warehousePrice: number;

    selectedAddress?: AddressModel;
    form?: FormGroup;

    expand?: boolean;
}

export interface RFQItemSkuDetails {
    brandIconImageUrl: string;
    buyerRfqItemBrandId: number;
    buyerRfqItemId: number;
    deliveryAddress: string;
    deliveryLocation: string;
    deliveryLocationCd: string;
    displayName: string;
    documents: DocumentModel[];
    id: number;
    imageUrl: string;
    maxQty: number;
    minPrice: number;
    minQty: number;
    note: string;
    pid: number;
    quotePrice: number;
    requestQty: number;
    requiredEndDt: string;
    requiredStartDt: string;
    rmcDesignMix: any;
    sellerRfqId: number;
    skuId: number;
    skuName: string;
    skuSlugUrl: string;
    specYn: string;
    specs: SkuSpecs[];
    status: string;
    statusCd: string;
    unit: string;
}


export interface SkuSpecs {
    id: number;
    maxQty: number;
    minQty: number;
    pid: number;
    price: number;
    requestQty: number;
    sellerRfqItemId: number;
    skuId: number;
    skuName: string;
    specCd: string;
    specId: number;
    specName: string;
}