import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { FieldRegExConst } from 'src/app/shared/constants';
import { Router } from '@angular/router';

@Component({
    selector: 'enter-mobile',
    templateUrl: './enter-mobile.component.html'
})
export class EnterMobileComponent implements OnInit {

    mobileVerifyForm: FormGroup;
    phone: number = null;
    constructor(private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private signinService: SigninSignupService,
        private _router: Router) { }

    ngOnInit(): void {

        if (this.signinService.isLoggedIn) {
            this._router.navigate([ '/lead' ]);
        }

        this.mobileVerifyForm = this._formBuilder.group({
            phone: [ '', {
                validators: [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.pattern(FieldRegExConst.PHONE)
                ]
            } ]
        });
    }

    /**
     * @description function to submit phone number and genrate OTP
     * @property {number} phone - to store the phone number formcontrol value
    */
    submit() {

        if (this.mobileVerifyForm.valid) {

            const phone = this.mobileVerifyForm.controls[ 'phone' ].value;

            /**
             * @description: This function is used to check if phone number exist
             */
            this.signinService.isPhoneExist(phone).then(res => {

                if (!res.alreadyRegistered) {
                    this.signinService.createOTP(phone).then(res => {
                        this._router.navigate([ 'auth/otp-verify' ])
                    });
                } else {
                    this._router.navigate([ 'auth/login' ])
                }
            });
        } else {
            FormHelper.validateAllFormFields(this.mobileVerifyForm);
        }
    }

}
