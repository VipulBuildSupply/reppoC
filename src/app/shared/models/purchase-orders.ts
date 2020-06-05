export class PoCategory {
    awarded?: PoOrders[];
    pending?: PoOrders[];
}

export class PoOrders {
    purchaseOrder: PurchaseOrders;
    orderItemList: OrderItemsList[];
}

export class PoList {
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

export class PoSummary {
    payments: [];
    totalAmount: string;
    totalRecieved: number;
    balanceAmount: number;
    requestedAmount: number;
}

export class PurchaseOrders extends PoList {
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
    shippingCost?: number;
    shortCloseAmount?: number;
    addresses: {
        displayName: string;
        rawText: boolean;
        type: string;
        address: Address;
        addressString?: string;
    }[];
}

export class OrderItemsList extends PoList {
    modifyDt: string;
    orderId: number;
    skuId: number;
    name: string;
    skuName?: string;
    imageUrl: string;
    requestQty: number;
    balanceQty: number;
    enqueuedQty: number;
    gstTax: number;
    hsn: string;
    interstate: string;
    sellerPrice: number;
    unit: string;
    deliveryList: DeliveryList[];
    brandIconImageUrl: string;
    deliverySummary: DeliverySummary;
    totalGst: number;
    totalCost: number;
    skuSlugUrl?: string;
    checked?: boolean;
}

export class DownloadPo {
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

export class Address {
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

export class DeliveryList {
    id: number;
    modifyDt: string;
    createDt: string;
    pid: number;
    itemId: number;
    seqNo: number;
    requestQty: number;
    requiredByDt: string;
    requestDt: string;
    acceptQty: number;
    deliverQty: number;
    acceptDt: string;
    status: string;
    statusCd: string;
    remark: string;
}

export class DeliverySummary {
    orderRequestQty: number;
    totalRequestQty: number;
    totalAcceptQty: number;
    totalEnqueueQty: number;
    maxRaiseAllowQty: number;
    totalRejectedQty: number;
    totalBalanceQty: number;
}

export class AllDeliveries {
    activeDeliveries: ActivePastDelivery[];
    pastDeliveries: ActivePastDelivery[];
    dispatchSchedules: DispatchSchedules[];
}

export class ActivePastDelivery {
    id: number;
    modifyDt: string;
    createDt: string;
    orderId: number;
    orderNo: string;
    invoice: string;
    invoiceDt: string;
    invoiceDtRaw: string;
    challanNo: string;
    challanDate: string;
    challanDateRaw: string;
    challanAttachId: number;
    materialTestAttachId: number;
    materialTestDt: string;
    materialTestDtRaw: string;
    materialTestNo: string;
    transporterName: string;
    transportModeCd: string;
    transportModeName: string;
    lorryReceiptNo: string;
    lorryReceiptAttachId: number;
    vehicleNo: string;
    driverName: string;
    driverPhone: string;
    statusCd: string;
    status: string;
    transportDt: string;
    transportDtRaw: string;
    invoiceAttachId: number;
    items: DeliveryItems[];
    ewayBillNo: string;
    ewayBillDate: string;
    ewayBillDateRaw: string;
    ewayBillAttachId: number;

    invoiceDocName?: string;
    eWayDocName?: string;
    challanDocName?: string;
    materialTestDocName?: string;
    lorryReceiptDocName?: string;

    invoiceSignedUrl?: string;
    eWaySignedUrl?: string;
    challanSignedUrl?: string;
    materialTestSignedUrl?: string;
    lorryReceiptSignedUrl?: string;
}

export class DispatchSchedules {
    id: number;
    pid: number;
    orderId: number;
    requiredByDate: string;
    requiredByDateRaw: string;
    statusCd: string;
    status: string;
    items: DispatchItems[];
}

export class DispatchItems {
    id: number;
    pid: number;
    deliveryPlanId: number;
    itemId: number;
    requestQty: number;
    requiredByDate: string;
    unit: string;
    imageUrl: string;
    name: string;
}

export class DeliveryItems {
    id: number;
    createDt: string;
    deliveryInvoiceId: number;
    itemId: number;
    itemQty: number;
    acceptQty: number;
    rejectQty: number;
    acceptDt: string;
    acceptDtRaw: string;
    deliverQty: number;
    unit: string;
    imageUrl: string;
    name: string;
    seqNo: number;
}