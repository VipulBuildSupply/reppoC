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