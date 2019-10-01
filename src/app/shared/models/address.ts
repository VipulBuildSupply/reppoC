import { catalogueCategories } from './catalogue';

export class Address {
    addressCategory: string;
    addressId?: 0;
    addressLine1: string;
    addressLine2: string;
    deliveryRange? : string;
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
    companyId?:any;
    users?: AddressUser[];
    addressProof ?: string;
    cityId?: number;
    stateId?: number;

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
        addressProof = '',
    }){
        this.addressCategory = addressCategory;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.phoneNo = phoneNo;
        this.pincode = pincode;
        this.state = new State(state || {});
        this.city = new City(city || {});
        this.stateId = stateId;
        this.cityId = cityId;
        this.addressProof = addressProof;
    }
}

export class City {
    id: number;
    name: string;

    constructor({id = null, name = ''}){
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

    constructor({cities = [], id = null, name = ''}){
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
    billing:Address;
    warehouse:Address;
}

export class BankDetails{
    id ?: number;
    accountHolderName ?: string;
    bankName ?: string;
    accountNumber ?: string;
    ifscCode ?: string;
    cancelledChequePhotoImage ?: any;
    userDomain: string;
    companyId?:any;
}

// class BusinessAddress{
//     addressLine1: string;
//     addressLine2: string;
//     phoneNo: string;
//     pincode: string;
//     city?: City;
//     addressProofFile?: string;
//     addressId?: number;
//     state?: State;

//     constructor({
//         addressLine1 = '',
//         addressLine2 = '',
//         phoneNo = '',
//         pincode = '',
//         state,
//         city,
//         addressProofFile = '',
//         addressId = 0
//     }){
//         this.addressLine1 = addressLine1;
//         this.addressLine2 = addressLine2;
//         this.phoneNo = phoneNo;
//         this.pincode = pincode;
//         this.state = new State(state || {});
//         this.city = new City(city || {});
//         this.addressProofFile = addressProofFile;
//         this.addressId = addressId;
//     }
// }

export class BusinessDetails{
    address?: Address;
    companyName?: string;
    gstin: string;
    minAnnualTurnover?: string;
    panNo?: string;
    panPhoto?: string;
    sellerBusinessType: string;
    categoryIds: catalogueCategories;

    constructor({
        address,
        sellerBusinessType = '',
        minAnnualTurnover = '',
        companyName = '',
        gstin = '',
        panNo = '',
        panPhoto = '',
        catagoryIds
    }){
        this.address = new Address(address || {});
        this.sellerBusinessType = sellerBusinessType;
        this.minAnnualTurnover = minAnnualTurnover;
        this.companyName = companyName;
        this.gstin = gstin;
        this.panNo = panNo;
        this.panPhoto = panPhoto;
        this.categoryIds = new catalogueCategories;
    }
}