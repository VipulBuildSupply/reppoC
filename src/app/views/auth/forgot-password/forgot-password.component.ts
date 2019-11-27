import { Component, OnInit, Input } from '@angular/core';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { SwitchUserProfileComponent } from 'src/app/shared/dialogs/switch-user-profile/switch-user-profile.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

    @Input('phone') phone: number;
    password: string = "";
    confirmPassword: string = "";
    forgotForm: FormGroup;
    passwordError: string;
    isPasswordMatch: boolean;
    phoneNumber: number;
    pass: string;
    confirmPass: string;

    constructor(private signinService: SigninSignupService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private userService: UserService,
        private _dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.phoneNumber = this.signinService.userPhone;
        this.forgotForm = this._formBuilder.group({
            password: [this.password, {
                validators: [
                    Validators.required,
                    Validators.minLength(6)
                ]
            }],
            confirmPassword: [this.confirmPassword, {
                validators: [
                    Validators.required
                ]
            }]
        })
    }


    /**
     * @description function to compare current and confirm passwords value
     * @property {string} pass - to store password value 
     * @property {string} confirmPass - to store confirm Password value
     * @return {boolean}
     */
    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        if (group) {
            let pass = group.controls.password.value;
            let confirmPass = group.controls.confirmPassword.value;
            this.isPasswordMatch = (pass === confirmPass) ? true : false;
        }
    }

    /**
     * @description function to submit the forgot password form
     * @property {string} passwordError - to store error message related to password
     * @property {object} data - to store forgot password form value
     */
    submit() {

        if (this.forgotForm.valid) {

            if (this.pass != this.confirmPass) {
                return;
            }

            const data: any = {};
            Object.keys(this.forgotForm.value).forEach((field) => {
                if ((this.forgotForm.value[field] !== null) && (this.forgotForm.value[field] !== '')) {
                    data[field] = this.forgotForm.value[field];
                }
            });

            data.phone = this.signinService.userPhone;

            this.signinService.resetPassword(data).then(res => {
                
                if(res.userType && res.userType == "BUYER"){
                    this.switchUserProfile(res);
                }else{
                    this.userService.getUserData();
                    this._router.navigate(['/profile-verification/status']);
                }
            }, err => {
                this.passwordError = err.message;
            });
        }
    }

    /**
     * @description function to open switch user profile popup when the entered user is buyer
     * @property {object} userData - to store UserModel data
     */
    switchUserProfile(userProfileData){
        const d = this._dialog.open(SwitchUserProfileComponent, {
            data: { userData: userProfileData },
            disableClose: true,
            panelClass: 'switch-profile-popup'
        });
    }

}