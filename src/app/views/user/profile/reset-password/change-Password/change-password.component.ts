import { Component, OnInit, Input } from '@angular/core';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

    @Input('phone') phone;
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
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.phoneNumber = this.signinService.userPhone;
        this.forgotForm = this._formBuilder.group({
            password: [this.password, {
                validators: [
                    Validators.required,
                    Validators.minLength(6),
                ]
            }],
            confirmPassword: [this.confirmPassword, {
                validators: [
                    Validators.required
                ]
            }]
        })
    }


    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        if (group) {
            let pass = group.controls.password.value;
            let confirmPass = group.controls.confirmPassword.value;
            this.isPasswordMatch = (pass === confirmPass) ? true : false;
        }
    }


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
                this.userService.getUserData();
                this._router.navigate(['/user/profile/personal']);
            }, err => {
                this.passwordError = err.message;
            });
        }
    }
}