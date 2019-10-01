import { Injectable } from '@angular/core';
import { UserModel, SellerPersonalProfile } from '../models/user.model';
import { DataService } from './data.service';
import { Subject } from 'rxjs';
import { TokenService } from './token.service';
import { Utils } from '../helpers/utils';
import { Address, BankDetails } from '../models/address';
import { API } from '../constants';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable()
export class UserService {

    constructor(private dataService: DataService,
        private token: TokenService) { }

    userUpdated$ = new Subject<UserModel>();
    editAddress$ = new Subject<Address>();
    editBankDetails$ = new Subject<BankDetails>();
    addressToEdit: Address;
    bankDetailsToEdit : BankDetails;
    isEdit: boolean;
    addressProofAdd : any = "";
    onProfileSwitch$ = new Subject();
    updatePercentage$ = new Subject();
    private _user: UserModel;

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
        if(user) {
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
            return this.setUser(res.data);
        })
    }
   
    get selectedProfile(): SellerPersonalProfile {
        return this.user.sellerPersonalProfile;
    }

    // get selectedProfile() {

    //     const status = () => {
    //         if (this.user.sellerPersonalProfile.isSelected) {
    //             return this.user.sellerPersonalProfile;
    //         } 
    //     }

    //     if (this.user) {
    //         return status();
    //     } else {

    //         return null;

    //     }
    // }



    getAddress(addressType) {
        return this.dataService.getRequest(`${API.ADDRESS}/${addressType}`).then(res => res);
    }
    getBankDetails(){
        return this.dataService.getRequest(`${API.BANK_DETAILS_GET}`).then(res => res);
    }
    deleteAddress(addressId: number) {
        return this.dataService.sendDeleteRequest(`${API.ADDRESS}/${addressId}`, {}).then(res => res)
    }
    
    deleteBankDetails(bankId : number){
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
            if(data[key]){
                fData.append(key, data[ key ]);
            }
            
        });

        return this.dataService.sendPostRequest(API.ADDRESS, fData).then(res => {
            return res.data
        })
    }

    addBankDetails(data) {
        const fData = new FormData();
        Object.keys(data).map(key => {
            if(data[key]){
                fData.append(key, data[ key ]);
            }
            
        });
        // const headers = 'Content-Type, multipart/form-data';

        return this.dataService.sendPostRequest(API.BANK_DETAILS, fData).then(res => {
            return res.data
        })

    }


    getPincode(pincode){
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

    emailVerify(data){
        return this.dataService.sendPostRequest(API.EMAIL_VERIFY, data).then((res: any) => res);
    }

    annualTurnovers(){
        return this.dataService.getRequest(API.ANNUAL_TURNOVERS).then(res => res.data);
    }

    businessType(){
        return this.dataService.getRequest(API.BUSINESS_TYPES).then(res => res.data);
    }

    editAddress(addressId,data){
        const fData = new FormData();
        Object.keys(data).map(key => {
            if(key != "addressProof"){
                fData.append(key, data[ key ]);
            }
        });

        return this.dataService.sendPutRequest(API.EDIT_ADDRESS(addressId), fData).then(res => {
          return res.data; 
        });
    }

    editBankDetails(bankId , data){
        const fData = new FormData();
        Object.keys(data).map(key => {
            if(key != "cancelledChequePhotoImage"){
                fData.append(key, data[ key ]);
            }
        });

        return this.dataService.sendPutRequest(API.EDIT_BANK_DETAILS(bankId), fData).then(res => {
          return res.data; 
        });
    }


    addBusinessDetails(data){
        
        localStorage.setItem('business', JSON.stringify(data));
        const fData = new FormData();
        // const aData = new FormData();
        Object.keys(data).map(key => {

            if(key == 'address'){
                data = data.address;
                Object.keys(data).map(key => {
                    if(data[key]){
                        // key = 'address'.concat(key);
                        fData.append('address.'.concat(key), data[ key ]);
                    }
                })
            }else if(data[key] == ""){
                fData.delete(key);
            }else{
                fData.append(key, data[ key ]);
            }
        });

        return this.dataService.sendPutRequest(API.BUSINESS_DETAILS, fData).then(res => {
            return res.data;
        });
    }

    getBusinessDetails(){
        return this.dataService.getRequest(API.BUSINESS_DETAILS).then(res => res.data);
    }
}