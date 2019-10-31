import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { FieldRegExConst } from 'src/app/shared/constants';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SwitchUserProfileComponent } from 'src/app/shared/dialogs/switch-user-profile/switch-user-profile.component';
import { MatDialog } from '@angular/material';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

    @Output() parentLinker = new EventEmitter<any>();
    phoneNumber;
    signinForm: FormGroup;
    password: string;
    isForgot:boolean;
    errorMsg: any;
    constructor(private commonService: CommonService,
        private signinService: SigninSignupService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _userService: UserService,
        private _dialog: MatDialog) { 
    }

    ngOnInit(): void {
        this.phoneNumber = this.signinService.userPhone;

        if(this.phoneNumber == undefined){
            this._router.navigate(['/auth/enter-mobile']);
        }

        this.signinForm = this._formBuilder.group({
            emailOrPhone: [ this.phoneNumber, {
                validators: [ 
                    Validators.required, 
                    Validators.pattern(FieldRegExConst.PHONE) 
                ]
            } ],
            password: [ this.password, {
                validators: [ 
                    Validators.required,
                ]
            } ]
        });
    }

    resetError(){
        this.errorMsg = '';
    }

    submit(): void {
        
        this.errorMsg='';

        if (this.signinForm.valid) {

            const data = {};
            Object.keys(this.signinForm.value).forEach((field) => {
                if ((this.signinForm.value[ field ] !== null) && (this.signinForm.value[ field ] !== '')) {
                    data[ field ] = this.signinForm.value[ field ];
                }
            });

            this.signinService.signin(data).then(res => {
                if(res.data.loggedInUserType == 'BUYER'){
                    this.switchUserProfile(res.data);
                }else{
                    this._userService.getUserData().then(res => {
                        // if(res.sellerPersonalProfile.verifyStatus == "Unverified"){
                            this._router.navigate(['profile-verification/status']);
                        // }else{
                            // this._router.navigate(['/user/profile/personal']);
                        // }
                    });
                }
            }, err => {
                this.errorMsg = err.message;
            });
            
        } else {
            FormHelper.validateAllFormFields(this.signinForm);
        }
    }

    forgot(){
        this.signinService.isForgot = true;
        this.signinService.createOTP(this.phoneNumber).then(res => {
            this._router.navigate(['auth/otp-verify'])
        });
    }


    loginOtp(){
        this.signinService.isLoginWithOtp = true;
        this.signinService.createOTP(this.phoneNumber).then(res => {
            this._router.navigate(['auth/otp-verify'])
        });
    }

    switchUserProfile(userProfileData){
        const d = this._dialog.open(SwitchUserProfileComponent, {
            data: { userData: userProfileData },
            disableClose: true,
            panelClass: 'switch-profile-popup'
        });
    }
}