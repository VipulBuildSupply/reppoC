export class DeliveryRequest {
    challanAttachId: number;
    challanDate: string;
    challanNo: string;
    driverName: string;
    driverPhone: string;
    eWayBillDate: string;
    ewayBillAttachId: number;
    ewayBillDate: string;
    ewayBillNo: string;
    invoiceAttachId: number;
    invoiceNo: string;
    lorryReceiptAttachId: number;
    lorryReceiptNo: string;
    materialTestAttachId: number;
    orderId: number;
    orderItemList: OrderItems[];
    transportDate: string;
    transportModeCd: string;
    transporterName: string;
    vehicleNo: string;
}

export class OrderItems {
    deliveryQty: number;
    poItemId: number;
}

export interface DocumentModel {
    accessType: string;
    bucketFilePath: string;
    cleanFileName: string;
    fileDownloadUri: string;
    filesize: number;
    id: number;
    localFilePath: string;
    mimeType: string;
    orginalFileName: string;
    responses?: null[];
    servingUrl: string;
    signedUrl: string;

    pid?: number;
}