import { catalogueCategories } from './catalogue';

export class Address {
    addressCategory: string;
    addressId?: 0;
    addressLine1: string;
    addressLine2: string;
    deliveryRange?: string;
    addressProofFile?: string;
    city: City;
    defaultAddress?: boolean;
    gstHolderName?: string;
    gstin?: string;
    name?: string;
    phoneNo: string;
    pincode: string;
    state: State;
    userType?: string;
    companyId?: any;
    users?: AddressUser[];
    addressProof?: string;
    cityId?: number;
    stateId?: number;
    addressProofAttachId?: number;

    constructor({
        addressCategory = 'COMPANY_REGISTERED',
        addressLine1 = '',
        addressLine2 = '',
        phoneNo = '',
        pincode = '',
        state,
        city,
        stateId = null,
        cityId = null,
        userType = 'SELLER',
        addressProofFile = '',
        addressId = null,
        addressProofAttachId = 0
    }) {
        this.addressCategory = addressCategory;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.phoneNo = phoneNo;
        this.pincode = pincode;
        this.state = new State(state || {});
        this.city = new City(city || {});
        this.stateId = stateId;
        this.cityId = cityId;
        this.userType = userType;
        this.addressProofFile = addressProofFile;
        this.addressId = addressId;
        this.addressProofAttachId = addressProofAttachId;
    }
}

export class City {
    id: number;
    name: string;

    constructor({ id = null, name = '' }) {
        this.id = id;
        this.name = name;
    }
}
export class Bank {
    id: number;
    name: string;
}


export class State {
    cities?: City[];
    id: 0;
    name: string;

    constructor({ cities = [], id = null, name = '' }) {
        this.cities = cities.map(city => new City(city)),
            this.id = id;
        this.name = name;
    }
}

export class AddressUser {
    companyId: 0;
    companyName: string;
    deleted: true;
    email: string;
    emailVerified: true;
    firstName: string;
    lastName: string;
    middleName: string;
    profileImageUrl: string;
    roleTag: string;
    suspended: true
}

export class SelectedAddress {
    billing: Address;
    warehouse: Address;
}

export class AddBulkFile {
    file?: any;
}

export class BankDetails {
    id?: number;
    accountHolderName?: string;
    bank?: BankName;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    cancelledChequePhotoImage?: any;
    userDomain: string;
    companyId?: any;
}

export class BusinessDetails {
    address?: Address;
    companyName?: string;
    gstin: string;
    minAnnualTurnover?: AnnualTurnover;
    panNo?: string;
    panPhoto?: string;
    sellerBusinessType?: BusinessType;
    categoryIds: catalogueCategories;
    addressProof: string;
    customCategories: string[];
    balanceSheets: BalanceSheets[];
    bankStatementAttachId: number;
    bankStatement?: string;
    freightTermCd: string;
    freightTermDisplayName?: string;
    gstCertificateAttachId: number;
    gstCertificate?: string;
    panPhotoAttachId: number;
    preferredTransporterName: string;
    preferredTransporterPhone: string;
    verificationStatus?: string;
    verificationStatusDisplayNameBuyer?: string;


    constructor({
        address,
        companyName = '',
        gstin = '',
        minAnnualTurnover,
        panNo = '',
        panPhoto = '',
        sellerBusinessType,
        catagoryIds,
        addressProof = '',
        customCategories,
        balanceSheets,
        bankStatementAttachId = 0,
        bankStatement = '',
        freightTermCd = '',
        freightTermDisplayName = '',
        gstCertificateAttachId = 0,
        gstCertificate = '',
        panPhotoAttachId = 0,
        preferredTransporterName = '',
        preferredTransporterPhone = '',
        verificationStatus = '',
        verificationStatusDisplayNameBuyer = ''
    }) {
        this.address = new Address(address || {});
        this.sellerBusinessType = sellerBusinessType || {};
        this.minAnnualTurnover = minAnnualTurnover || {};
        this.companyName = companyName;
        this.gstin = gstin;
        this.panNo = panNo;
        this.panPhoto = panPhoto;
        this.categoryIds = new catalogueCategories;
        this.addressProof = addressProof;
        this.customCategories = this.customCategories;
        this.balanceSheets = balanceSheets.map(sheet => new BalanceSheets(sheet));
        this.bankStatementAttachId = bankStatementAttachId;
        this.bankStatement = bankStatement;
        this.freightTermCd = freightTermCd;
        this.freightTermDisplayName = freightTermDisplayName;
        this.gstCertificateAttachId = gstCertificateAttachId;
        this.gstCertificate = gstCertificate;
        this.panPhotoAttachId = panPhotoAttachId;
        this.preferredTransporterName = preferredTransporterName;
        this.preferredTransporterPhone = preferredTransporterPhone;
        this.verificationStatus = verificationStatus;
        this.verificationStatusDisplayNameBuyer = verificationStatusDisplayNameBuyer;
    }
}

export class AnnualTurnover {
    code?: string;
    displayName?: string;
}

export class BusinessType {
    code?: string;
    displayName?: string;
}
export class BankName {
    code: string;
    name: string;
}

export class BalanceSheets{
    attachId: number;
    attachUrl: string;
    createDt: string;
    id: number;
    modifyDt: string;
    note: string;
    pid: number;
    year: string;

    constructor({
        attachId = 0,
        attachUrl = '',
        createDt = '',
        id = 0,
        modifyDt = '',
        note = '',
        pid = 0,
        year = ''
    }){
        this.attachId = attachId;
        this.attachUrl = attachUrl;
        this.createDt = createDt;
        this.id = id;
        this.modifyDt = modifyDt;
        this.note = note;
        this.pid = pid;
        this.year = year;
    }
}