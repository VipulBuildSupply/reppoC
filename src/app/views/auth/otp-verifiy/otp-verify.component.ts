import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { ConfigurationConstants } from 'src/app/shared/constants';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SwitchUserProfileComponent } from 'src/app/shared/dialogs/switch-user-profile/switch-user-profile.component';

@Component({
    selector: 'otp-verify',
    templateUrl: './otp-verify.component.html'
})
export class OtpVerifyComponent implements OnInit, OnDestroy {

    time = {
        min: 0,
        sec: 60
    };
    otpVerifyForm: FormGroup;
    timer;
    otp1 = '';
    otp2 = '';
    otp3 = '';
    otp4 = '';

    activeOtp: boolean = false;
    isForget: boolean;

    @Input('phone') phone: string;
    phoneNumber: any;
    errorMsg: any;

    constructor(private commonService: CommonService,
        private _formBuilder: FormBuilder,
        private signinService: SigninSignupService,
        private _router: Router,
        private _dialog: MatDialog) { }


    ngOnInit(): void {

        this.isForget = this.signinService.isForgot;
        this.phone = this.signinService.userPhone;

        if(this.phone == undefined){
            this._router.navigate(['/auth/enter-mobile']);
        }

        //this.commonService.otmTimer.subscribe(val => val ? this.startTimer() : this.stopTimer());
        /*this.signinService.createOTP(this.phone).then(res => {
            if(res.status == 1001){
                return res;
            } else {
                throw res;
            }
        });*/

        this.startTimer();

        this.otpVerifyForm = this._formBuilder.group({
            otp1: [this.otp1, {
                Validators: [Validators.required, Validators.maxLength(1), Validators.minLength(1)]
            }],
            otp2: [this.otp1, {
                Validators: [Validators.required, Validators.maxLength(1), Validators.minLength(1)]
            }],
            otp3: [this.otp1, {
                Validators: [Validators.required, Validators.maxLength(1), Validators.minLength(1)]
            }],
            otp4: [this.otp1, {
                Validators: [Validators.required, Validators.maxLength(1), Validators.minLength(1)]
            }]
        });
    }

    /**
         * @description: This function is used to start OTP timer
         */
    startTimer() {

        this.resetTimer();

        if(this.timer){
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.time.sec--;
            this.time.min = 0;

            if (this.time.sec <= 0) {
                this.time.sec = 0;
                this.time.min = 1;
                clearInterval(this.timer);
                this.activeOtp = true;
            }
        }, 1000);
    }

    /**
     * @description : this function is used to rest OTP timer
     */
    resetTimer() {
        this.activeOtp = false;
        this.time = { min: 0, sec: 60 };
    }


    /**
    * @description: This function is used to stop OTP Timer
    */
    stopTimer() {
        clearInterval(this.timer);
        this.resetTimer();
    }

    /**
     * @description This function is used for Resend OTP
     */

    resendOtp() {
        this.otpVerifyForm.reset();
        this.activeOtp = false;

        this.signinService.createOTP(this.phone).then(res => {
            if(res.status == 1001){
                return res;
            } else {
                throw res;
            }
        });

        this.resetTimer();
        this.startTimer();
    }


    /**
     * @description This function is used to submit OTP form
     */

    submit(): void {

        if (this.otpVerifyForm.valid) {

            const otp = Object.values(this.otpVerifyForm.value).join('');

            const data: any = {
                otp,
                phone: this.signinService.userPhone,
            }
            if (this.signinService.isForgot || this.signinService.isLoginWithOtp) {
                data.userType = ConfigurationConstants.USER_TYPE
            }

            this.signinService.verifyOTP(data).then(res => {

                if (res.success) {
                    if (this.signinService.isForgot) {

                        this.signinService.isForgot = false;
                        this._router.navigate(['auth/forgot-password'])

                    }else if(this.signinService.isLoginWithOtp){

                        if(res.userType && res.userType == "BUYER"){
                            this.switchUserProfile(res);
                        }else{
                            this.signinService.isLoginWithOtp = false;
                            this._router.navigate(['/open-tile/list']);
                        }

                    } else {
                        this._router.navigate(['auth/signup'])
                    }

                } else {
                    // show error
                    this.errorMsg = res.message;
                    if(this.errorMsg){
                        this.otpVerifyForm.reset();
                    }
                    FormHelper.validateAllFormFields(this.otpVerifyForm);
                }
            });

        } else {
            FormHelper.validateAllFormFields(this.otpVerifyForm);
        }
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.stopTimer();
    }

    switchUserProfile(userProfileData){
        const d = this._dialog.open(SwitchUserProfileComponent, {
            data: { userData: userProfileData },
            disableClose: true,
            panelClass: 'switch-profile-popup'
        });
    }

}
