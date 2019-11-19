import { Injectable } from '@angular/core';
import { UserModel, SellerPersonalProfile } from '../models/user.model';
import { DataService } from './data.service';
import { Subject } from 'rxjs';
import { TokenService } from './token.service';
import { Address, BankDetails } from '../models/address';
import { API } from '../constants';

@Injectable()
export class UserService {

    constructor(private dataService: DataService,
        private token: TokenService) { }

    userUpdated$ = new Subject<UserModel>();
    editAddress$ = new Subject<Address>();
    editBankDetails$ = new Subject<BankDetails>();
    addressToEdit: Address;
    bankDetailsToEdit: BankDetails;
    isEdit: boolean;
    addressProofAdd: any = "";
    onProfileSwitch$ = new Subject();
    updatePercentage$ = new Subject();
    private _user: UserModel;
    enableProfile$ = new Subject<boolean>();

    get user(): UserModel {
        return localStorage.getItem('user') ? new UserModel(JSON.parse(localStorage.getItem('user'))) : null;
    }

    setUser(user: UserModel) {

        if (localStorage.getItem('user')) {
            const oldUserInfo = JSON.parse(localStorage.getItem('user'));
            user = Object.assign(oldUserInfo, user);
        }
        this._user = new UserModel(user);

        /**
         * @description Setup User
         */
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        this.userUpdated$.next(user);
        return user;
    }

    removeUser() {
        localStorage.removeItem('user');
        localStorage.removeItem('AccessToken');
        this.userUpdated$.next(null);
    }


    getUserData() {
        return this.dataService.getRequest(API.PROFILE).then(res => {

            if (res.data.userType === "BUYER") {
                return res.data;
            } else {
                return this.setUser(res.data);
            }

            /*if(res.data.seller){
                return this.setUser(res.data);
            }else{
                return this.isBuyer('SELLER', res.data);
            }*/
        })
    }

    get selectedProfile(): SellerPersonalProfile {
        return this.user.sellerPersonalProfile;
    }
    deleteCancelledChequeAPI(bankAccountId) {
        return this.dataService.sendDeleteRequest(API.DELETE_CANCELLED_CHEQUE(bankAccountId), {}).then(res => res);
    }

    getAddress(addressType) {
        return this.dataService.getRequest(`${API.ADDRESS}/${addressType}`).then(res => res);
    }
    getBankDetails() {
        return this.dataService.getRequest(`${API.BANK_DETAILS_GET}`).then(res => res);
    }
    deleteAddress(addressId: number) {
        return this.dataService.sendDeleteRequest(`${API.ADDRESS}/${addressId}`, {}).then(res => res);
    }

    deleteBankDetails(bankId: number) {
        //   console.log(`${API.DELETE_BANK_DETAILS}/${bankId}`);
        return this.dataService.sendDeleteRequest(API.DELETE_BANK_DETAILS(bankId), {}).then(res => res);

    }

    getStates() {
        return this.dataService.getRequest(API.STATE).then(res => res)
    }
    getCities(stateId) {
        return this.dataService.getRequest(API.CITY(stateId)).then(res => res)
    }

    addAddress(data) {
        const fData = new FormData();
        Object.keys(data).map(key => {
            if (data[key]) {
                fData.append(key, data[key]);
            }

        });
        // const headers = 'Content-Type, multipart/form-data';

        return this.dataService.sendPostRequest(API.ADDRESS, fData).then(res => {
            return res.data
        })
    }

    addBankDetails(data) {
        const fData = new FormData();
        Object.keys(data).map(key => {
            if (data[key]) {
                fData.append(key, data[key]);
            }

        });
        // const headers = 'Content-Type, multipart/form-data';

        return this.dataService.sendPostRequest(API.BANK_DETAILS, fData).then(res => {
            return res.data
        })

    }

    getPincode(pincode) {
        return this.dataService.getRequest(API.PINCODE(pincode)).then(res => res)
    }

    updateProfile(data) {
        return this.dataService.sendPutRequest(API.PROFILE_UPDATE, data).then(res => res.data)
    }

    updatePhoto(data) {
        return this.dataService.sendPostRequest(API.PROFILE_IMAGE, data).then(res => res.data)
    }

    getUserPercentage() {
        return this.dataService.getRequest(API.GET_PERCENTAGE).then(res => {
            //this.onUpdatePercentage$.next(res.data);
            return res.data;
        });
    }

    profileVerify(data, email) {
        return this.dataService.sendPutRequest(API.PROFILE_VERIFY(email), data).then((res: any) => res);
    };

    editAddress(addressId, data) {
        const fData = new FormData();
        Object.keys(data).map(key => {
            if (key != "addressProof") {
                fData.append(key, data[key]);
            }
        });

        return this.dataService.sendPutRequest(API.EDIT_ADDRESS(addressId), fData).then(res => {
            return res.data;
        });
    }

    editBankDetails(bankId, data) {
        const fData = new FormData();
        Object.keys(data).map(key => {
            if (key == "cancelledChequePhotoImage") {
                if (data[key].name) {
                    fData.append(key, data[key]);
                }
            }
            else {
                fData.append(key, data[key]);
            }
        });
        return this.dataService.sendPostRequest(API.EDIT_BANK_DETAILS(bankId), fData).then(res => {
            return res.data;
        });
    }

    emailVerify(data) {
        return this.dataService.sendPostRequest(API.EMAIL_VERIFY, data).then((res: any) => res);
    }

    annualTurnovers() {
        return this.dataService.getRequest(API.ANNUAL_TURNOVERS).then(res => res.data);
    }

    businessType() {
        return this.dataService.getRequest(API.BUSINESS_TYPES).then(res => res.data);
    }

    getCategory() {
        return this.dataService.getRequest(API.GET_CATEGORY_ONE).then(res => res.data);
    }
    getBrand(categoryId) {
        return this.dataService.getRequest(API.GET_BRAND(categoryId)).then(res => res.data);
    }
    getSearchResults(data) {
        // const fData = new FormData();
        // Object.keys(data).map(key => {
        //     if(data[key]){
        //         fData.append(key, data[ key ]);
        //     }

        // });

        return this.dataService.sendPostRequest(API.SEARCH_SKU, data).then((res: any) => res);
    }
    addCatalogueItems(data) {
        return this.dataService.sendPutRequest(API.ADD_CATALOGUE, data).then((res: any) => res);
    }
    getCatalogueItems() {
        return this.dataService.getRequest(API.GET_CATALOGUE_LIST).then((res: any) => res);
    }
    getUniqueCatalogueItem(catalogueItemId) {
        return this.dataService.getRequest(API.GET_UNIQUE_CATALOGUE(catalogueItemId)).then((res: any) => res);
    }
    toggleStockStatus(catalogueId, status) {
        return this.dataService.sendPutRequest(API.TOGGLE_STOCK_STATUS(catalogueId, status), null).then((res: any) => res);
    }

    sendPricingToAllWarehouse(arrayData) {
        return this.dataService.sendPutRequest(API.PRICING_FOR_ALL_WAREHOUSE, arrayData).then((res: any) => res);
    }

    getBankName() {
        return this.dataService.getRequest(API.GET_BANK_NAME).then((res: any) => res);
    }


    updateBusinessDetails(data) {
        const fData = new FormData();
        Object.keys(data).map(key => {

            //if(edit == true){
            if (key == 'address') {
                data = data.address;
                Object.keys(data).map(key => {
                    if (data[key]) {
                        fData.append('address.'.concat(key), data[key]);
                    }
                })
            } else if (key == "panPhoto") {
                if (data[key].name) {
                    fData.append(key, data[key]);
                }
            } else {
                fData.append(key, data[key]);
            }

            /*}else{
                if(key == 'address'){
                    data = data.address;
                    Object.keys(data).map(key => {
                        if(data[key]){
                            fData.append('address.'.concat(key), data[ key ]);
                        }
                    })
                }else if(data[key] == ""){
                    fData.delete(key);
                }else{
                    fData.append(key, data[ key ]);
                }
            } */
        });

        return this.dataService.sendPutRequest(API.BUSINESS_DETAILS, fData).then(res => res);
    }

    getBusinessDetails() {
        return this.dataService.getRequest(API.BUSINESS_DETAILS).then(res => {

            return res.data;
        });
    }

    deleteAddressProof(addressId: number) {
        return this.dataService.sendDeleteRequest(API.DELETE_ADDRESS_PROOF(addressId), {}).then(res => res);
    }

    isBuyer(data) {
        return this.dataService.sendPostRequest(API.IS_BUYER_USER, data).then(res => {
            return this.token.saveAccessToken(res.data.jwtToken);
        });
    }

    getSkuListFromSearch(text) {
        return this.dataService.sendPostRequest(API.SEARCH_SKU_TEXT, text).then(res => res);
    }
    sendSkuToEmail(data) {
        return this.dataService.sendPostRequest(API.SEND_TO_EMAIL, data).then(res => res);
    }
    updateFileBulkCat(data) {
        return this.dataService.sendPostRequest(API.FILE_BULK_CATALOGUE, data).then(res => res.data)
    }
    getLeadsAll(){
        return this.dataService.getRequest(API.GET_ALL_LEADS).then((res: any) => res);
    }

    getNewLeads() {
        return this.dataService.getRequest(API.GET_NEW_LEADS).then((res: any) => res);
    }
    getActedLeads() {
        return this.dataService.getRequest(API.GET_ACTED_LEADS).then((res: any) => res);
    }
    saveLeadAsBookmark(skuId, Status) {
        return this.dataService.sendPutRequest(API.ADD_BOOKMARK_SAVE_LEADS(skuId, Status), null).then(res => res);
    }

    DismissLead(skuId, Status) {
        return this.dataService.sendPutRequest(API.ADD_BOOKMARK_SAVE_LEADS(skuId, Status), null).then(res => res);
    }

    getLeadObj(leadId) {
        return this.dataService.getRequest(API.GET_LEAD_OBJ(leadId)).then((res: any) => res);
    }

    sendQuoteToAllWarehouse(data, leadID) {

        return this.dataService.sendPostRequest(API.QUOTE_SUBMIT_ALL_WAREHOUSE(leadID), data).then(res => res);

    }

    getLeadsAll(){
        return this.dataService.getRequest(API.GET_ALL_LEADS).then((res: any) => res);
    }


}