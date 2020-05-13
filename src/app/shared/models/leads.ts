export class Filters {
    locations?: LocationsLists[];
    categories?: CategoriesLists[];
}

export class FilterList {
    id: number;
    name: string;
    code: string;
    type?: string;
    selected?: boolean;
}

export class LocationsLists extends FilterList {
    stateCode: string;
    stateId: number;
}

export class CategoriesLists extends FilterList {
    imageUrl: string;
    iconImageUrl: string;
    fullName: string;
    categoryList?: any[];
}

export interface UpdatedData {
    data: LocationsLists[] | CategoriesLists[];
    type: string
}

export class Leads {
    id: number;
    pid: number;
    skuId: number;
    skuName: string;
    unit: string;
    requestQty: number;
    minQty: number;
    maxQty: number;
    expireDt: string;
    paymentTerm: string;
    paymentTermId: number;
    note: string;
    opsAttachId: number;
    opsAttachments: any[];
    deliveryAddress: string;
    deliveryLocation: string;
    deliveryLocationCd: string;
    requiredStartDt: string;
    requiredEndDt: string;
    status: string;
    statusCd: string;
    imageUrl: string;
    brandIconImageUrl: string;
    minPrice: number;
    quotePrice: number;
    priceValidEndDt: string;
    attachId: number;
    documents: any[];
    sellerPaymentTerm: string;
    sellerNote: string;
    specs: string;
    samePriceAllWarehouse: boolean;
    expired: boolean;
}

export interface LeadListItemModel {
    attachId: number;
    brandIconImageUrl: string;
    deliveryAddress: string;
    deliveryLocation: string;
    deliveryLocationCd: string;
    documents: any[];
    expireDt: string;
    expired: boolean;
    id: number;
    imageUrl: string;
    maxQty: number;
    minPrice: number;
    minQty: number;
    note: string;
    opsAttachId: number;
    opsAttachments: any[];
    paymentTerm: string;
    paymentTermId: number;
    pid: number;
    priceValidEndDt: string;
    quotePrice: number;
    requestQty: number;
    requiredEndDt: string;
    requiredStartDt: string;
    samePriceAllWarehouse: boolean;
    sellerNote: string;
    sellerPaymentTerm: string;
    skuId: number;
    skuName: string;
    skuSlugUrl: string;
    specs: string;
    status: string;
    statusCd: string;
    unit: string;


    skuList?: any[]
    allLocations?: string;
}


export interface SkuModel {
    name: string;
    specs?: string[];
    qty: number;
    location: string;
    id: number;
};

export interface TermChild {
    code: string;
    displayName: string;
    id: number;
    name: string;
    pid: number;
    slug: string;
}
export interface TermModel extends TermChild {

    childList: TermChild[];
}


export interface RfqSubmitModel {
    freightTermCd: string;
    minQty: number;
    note: string;
    paymentTerm: string;
    price: number;
    sellerRfqItemId: number;
    specRelId: string;
    validEndDt: string;
    warehouseId: number;
}

