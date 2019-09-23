import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SigninSignupService } from 'src/app/shared/services/signin-signup.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { FieldRegExConst } from 'src/app/shared/constants';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-resetPassword',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    otp: any;
    [x: string]: any;
    resetPass;
    constructor(private signinService: SigninSignupService,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private activatedRoute: ActivatedRoute,) { }
    ngOnInit(): void {
        this.otp = this.activatedRoute.snapshot.data.resetPass.data;
        this.resetPass=false;
    } 

}
