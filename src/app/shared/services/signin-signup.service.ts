import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ConfigurationConstants, API } from '../constants';
import { Utils } from '../helpers/utils';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification-service';
import { UserModel } from '../models/user.model';
import { CategoryService } from './category.service';

@Injectable()
export class SigninSignupService {

    userPhone: any;
    private _loginStatus: boolean;
    isForgot: boolean;
    isLoginWithOtp: boolean;
    user: UserModel;
    constructor(private dataService: DataService,
        private token: TokenService,
        private userService: UserService,
        private router: Router,
        private notify: NotificationService,
        private _categoryService: CategoryService) {

    }

    get isLoggedIn() {
        return localStorage.getItem('user') != null;
    }


    isPhoneExist(phone: string): any {
        this.userPhone = phone;
        const obj = {
            "phone": phone,
            "userType": ConfigurationConstants.USER_TYPE
        }

        return this.dataService.sendPostRequest(`${API.IS_PHONE_EXIST}`, obj)
            .then(res => res.data);
    }

    createOTP(phone) {
        const api = `${API.CREATE_OTP}${phone}`;

        if (this.isForgot) {
            api + `?userType=${ConfigurationConstants.USER_TYPE}`
        }

        return this.dataService.sendPostRequest(api, {}).then(res => res);
    }

    verifyOTP(obj, userType?) {

        if (userType == "true") {
            obj.userType = ConfigurationConstants.USER_TYPE;
        }

        const headers = 'Content-Type, application/x-www-form-urlencoded';

        return this.dataService.sendPostRequest(`${API.VERIFY_OTP}`,
            Utils.JSON_to_URLEncoded(obj, null, null), { headers }).then(res => {

                if (res.data.jwtToken) {
                   return this._localLogin(res.data.jwtToken).then(_ => {
                        return res.data
                    });
                }
                return res.data
            })
    }

    signUp(data) {

        data.userType = ConfigurationConstants.USER_TYPE;

        return this.dataService.sendPostRequest(`${API.SIGNUP}`, data).then(res => {
            if (res.status == 1001) {
               return this._localLogin(res.data.jwtToken).then(_ => {
                return res;
               });
                
            } else {
                throw res;
            }
        });
    }

    signin(data) {
        data.userType = ConfigurationConstants.USER_TYPE;

        return this.dataService.sendPostRequest(API.SIGNIN, data).then(res => {
            if (res.status == 1001) {
                return this._localLogin(res.data.jwtToken).then(_ => {
                    this.notify.snack('Logged In Successfully');
                    return res;
                });
               
            } else {
                throw res;
            }
        });
    }

    resetPassword(data) {

        data.userType = ConfigurationConstants.USER_TYPE;

        return this.dataService.sendPostRequest(API.RESET_PASSWORD, data).then(res => {
            if (res.data.jwtToken) {
                return this._localLogin(res.data.jwtToken).then(_ => {
                    this.notify.snack('Reset Password Successfully');
                    return res
                });
            }else{
                return res;
            }
           
        });

    }

    refreshUserToken(companyId, selectedProfileType) {
        return this.dataService.sendPostRequest(`${API.REFRESH_USER_TOKEN}${companyId}`, {}).then(res => {

            if (res.data.jwtToken) {
               return this._localLogin(res.data.jwtToken).then(_ => {

                    return res
                });
            } 

                return res;
            
        })
    }

    private _localLogin(token) {
        this._loginStatus = true;
        this.token.saveAccessToken(token);
        return this.userService.getUserData();
    }

    logout() {
        this.router.navigate([ '/auth/enter-mobile' ]).then(_ => {
            this.token.clearToken();
            this.userService.removeUser();
            this._categoryService.removeCategories();
        });
    }
}