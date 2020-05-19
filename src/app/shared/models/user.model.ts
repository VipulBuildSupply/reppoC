import { first, retry } from 'rxjs/operators';

export class UserModel {
    phone: string;
    userType: string;
    sellerPersonalProfile: SellerPersonalProfile;
    seller: boolean;
    buyer: boolean;
    operator: boolean;
    //selectedProfile: string;

    constructor({ phone = '', userType = "", seller = true, buyer = false, operator = false, sellerPersonalProfile }) {
        this.phone = phone;
        this.userType = userType;
        this.seller = seller;
        this.buyer = buyer;
        this.operator = operator;
        this.sellerPersonalProfile = new SellerPersonalProfile(sellerPersonalProfile);
        //this.selectedProfile = selectedProfile;

        this.saveUserLocally();
    }

    saveUserLocally(user?: UserModel) {
        localStorage.setItem('user', JSON.stringify(user || this));
    }
}

export class SellerPersonalProfile {
    deleted: boolean;
    email?: string;
    emailVerified: boolean;
    hideRequestVerification: boolean;
    profileCompletePercentage: number;
    profileImageUrl?: string;
    roleTag: string;
    suspended: boolean;
    isSelected?: boolean;
    type?: string;
    companyId?: number;
    userId: number;
    verifyStatus: 'Unverified' | 'Verified' | 'Verification In Progress';
    verifyStatusCode: string;
    firstName?: string;

    constructor({
        deleted = false,
        email = "",
        emailVerified = false,
        hideRequestVerification = false,
        profileCompletePercentage = 0,
        profileImageUrl = "",
        roleTag = "",
        suspended = false,
        userId = 0,
        verifyStatus = "",
        verifyStatusCode = "",
        firstName = "",
        isSelected = false,
        type = '',
        companyId = 0
    }) {
        this.deleted = deleted;
        this.email = email;
        this.emailVerified = emailVerified;
        this.hideRequestVerification = hideRequestVerification;
        this.profileCompletePercentage = profileCompletePercentage,
            this.profileImageUrl = profileImageUrl;
        this.roleTag = roleTag;
        this.suspended = suspended;
        this.userId = userId;
        this.verifyStatus = verifyStatus;
        this.verifyStatusCode = verifyStatusCode;
        this.firstName = firstName;
        this.isSelected = isSelected;
        this.type = type;
        this.companyId = companyId;
    }

}