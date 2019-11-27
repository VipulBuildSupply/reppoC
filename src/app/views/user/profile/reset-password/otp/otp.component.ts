import { Component, OnInit, Input } from '@angular/core';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { ResetPasswordComponent } from '../reset-password.component';
import { UserService } from 'src/app/shared/services/user.service';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { OtpTimer } from 'src/app/shared/models/otp';
@Component({
    selector: 'app-otp',
    templateUrl: './otp.component.html'
})
export class OtpComponent implements OnInit {
    constructor(private signinService: SigninSignupService,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private userService: UserService,
        private resetPasswordComponent: ResetPasswordComponent) { }

    time: OtpTimer = {
        min: 0,
        sec: 60
    };
    otpVerifyForm: FormGroup;
    timer;
    otp1 = '';
    otp2 = '';
    otp3 = '';
    otp4 = '';
    resendotp: boolean = false;
    errorMsg: string;
    isForget: boolean;

    @Input('phone') phone: string;

    ngOnInit(): void {
        this.startTimer();
        this.phone = this.userService.user.phone;
        this.isForget = this.signinService.isForgot;
        this.commonService.otmTimer.subscribe(val => val ? this.startTimer() : this.stopTimer());

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
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.time.sec--;
            this.time.min = 0;
            if (this.time.sec <= 0) {
                this.time.sec = 0;
                this.time.min = 1;

                clearInterval(this.timer);
                this.resendotp = true;
            }
        }, 1000);
    }

    /**
     * @description : this function is used to rest OTP timer
     */
    resetTimer() {
        this.resendotp = false;
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
        this.resendotp = false;
        this.signinService.createOTP(this.phone).then(res => {
            if (res.status == 1001) {
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

            this.signinService.verifyOTP({
                otp,
                phone: this.phone,
            }).then(res => {
                if (res.success) {
                    this.resetPasswordComponent.resetPass = true;

                } else {
                    // show error
                    this.errorMsg = res.message;
                    if (this.errorMsg) {
                        this.otpVerifyForm.reset();
                    }
                    FormHelper.validateAllFormFields(this.otpVerifyForm);
                }
            })
        } else {
            FormHelper.validateAllFormFields(this.otpVerifyForm);
        }

    }
}