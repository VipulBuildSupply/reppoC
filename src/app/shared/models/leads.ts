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

export class Leads{
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