export class Address {
    addressCategory: string;
    addressId?: 0;
    addressLine1: string;
    addressLine2: string;
    deliveryRange : string;
    addressProofFile?: string;
    city: City;
    defaultAddress: boolean;
    gstHolderName: string;
    gstin: string;
    name: string;
    phoneNo: string;
    pincode: string;
    state: State;
    userType: string;
    companyId?:any;
    users?: AddressUser[];
    addressProof ?: string;
}

export class City {
    id: number;
    name: string;
}
export class Bank {
    id: number;
    name: string;
}


export class State {
    cities?: City[];
    id: 0;
    name: string
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