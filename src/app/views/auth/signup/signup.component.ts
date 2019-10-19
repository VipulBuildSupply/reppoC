import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { FieldRegExConst } from 'src/app/shared/constants';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

    @Output() parentLinker = new EventEmitter<any>();

    password = "";
    confirmPassword = "";
    signupForm: FormGroup;
    passwordError: any;
    isPasswordMatch: boolean;
    CustomValidators: any;
    mobileNumber: number;
    terms: any;

    constructor(private _formBuilder: FormBuilder,
        private signinService: SigninSignupService,
        private _router: Router,
        private _categoryService: CategoryService) { }

    ngOnInit(): void {

        this.mobileNumber = this.signinService.userPhone;

        
        

        if(this.mobileNumber == undefined){
            this._router.navigate(['/auth/enter-mobile']);
        }1

        this.signupForm = this._formBuilder.group({

            password: [this.password, {
                validators: [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.pattern(FieldRegExConst.PASSWORD)
                ]
            }],
            confirmPassword: [this.confirmPassword, {
                validators: [
                    Validators.required,
                ]
            }],

            terms: [this.terms, {
                validators: [
                    Validators.required
                ]
            }]

        });

    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        if (group) {
            let pass = group.controls.password.value;
            let confirmPass = group.controls.confirmPassword.value;
            this.isPasswordMatch = (pass === confirmPass) ? true : false;
        }
    }

    submit() {

        if (this.signupForm.valid) {

            const data: any = {};

            Object.keys(this.signupForm.value).forEach((field) => {
                if ((this.signupForm.value[field] !== null) && (this.signupForm.value[field] !== '')) {
                    data[field] = this.signupForm.value[field];
                }
            });

            data.phone = this.signinService.userPhone;

            this.signinService.signUp(data).then(res => {
                this._router.navigate(['/open-tile/list']);
            }, err => {
                this.passwordError = err.message;
            });
        }
    }

}
