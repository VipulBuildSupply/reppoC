export class POOrders{
    purchaseOrder: PurchaseOrders;
    orderItemList: OrderItemsList[];
}

export class POList{
    cgstAmount?: number;
    createDt: string;
    id: number;
    igstAmount: number;
    imgUrl: string;
    paymentTerm?: string;
    pid: number;
    sellerName: string;
    sgstAmount?: number;
    status?: string;
    statusCd?: string;
    totalAmount: number;
}

export class PurchaseOrders extends POList{
    buyerAddress: string;
    contractCondition?: string;
    creditDay: number;
    deliveryAddress: string;
    deliveryDt?: string;
    deliveryLocation: string;
    formatCreateDt: string;
    note?: string;
    orderNo: string;
    remark?: string;
    sellerAddress: string;
    termCondition?: string;
    totalItem?: number;
    totalItemAmount?: number;
    transporterTermCondition?: string;
    // poAddress?: POAddress;
    shippingCost?: number;
    addresses:{
        displayName: string;
        rawText: boolean;
        type: string;
        address: Address
    }[];
}

export class OrderItemsList extends POList{ 
    deliveryList: any[];
    gstTax: number;
    hsn: string;
    imageUrl: string;
    interstate: string;
    modifyDt: string;
    name: string;
    orderId: number;
    requestQty: number;
    sellerPrice: number;
    skuId: number;
    skuName?: string;
    unit: string;
}

export class DownloadPO{
    accessType?: string;
    bucketFilePath: string;
    cleanFileName: string;
    fileDownloadUri: string;
    filesize: number;
    id: number;
    localFilePath?: string;
    mimeType?: string;
    orginalFileName: string;
    servingUrl?: string;
    signedUrl: string;
}

// export class POAddress{
//     billingAddress: Addresses;
//     deliveryAddress: Addresses;
//     sellerAddress: Addresses;
// }

export class Address{
    addressLine1: string;
    addressLine2: string;
    addressTypeCode: string;
    city: string;
    cityCd: string;
    cityId: number;
    countryId?: number;
    createrId: number;
    deleted: boolean;
    deliveryRange?: number;
    id: number;
    inviteId: number;
    isDefault: boolean;
    modifierId: number;
    modifyDt: string;
    name: string;
    phoneNo: string;
    pincode: string;
    state: string;
    stateCd: string;
    stateId: number;
    userId: number;
    gstin?: string;
}

export class StateInfo{
    id: number;
    name: string;
    code: string;
    countryId?: number;
}

export class CityInfo extends StateInfo{
    stateCode: string;
    stateId: number;
}