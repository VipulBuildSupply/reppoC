import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Address, BankDetails, BankName } from 'src/app/shared/models/address';
import { ConfigurationConstants, FieldRegExConst } from 'src/app/shared/constants';
import { FormHelper } from 'src/app/shared/helpers/form-helper';

@Component({
    selector: 'app-add-bank-details',
    templateUrl: './add-bank-details.component.html'
})
export class AddBankDetailsComponent implements OnInit {
    cancelledChequeDeleted: boolean;
    constructor(private _formBuilder: FormBuilder,
        private _activatedRout: ActivatedRoute,
        private _router: Router,
        private _userService: UserService) { }

    bankDetailsForm: FormGroup;
    bankDetails: BankDetails;
    bankNames: any;
    ifscPrefix: any;
    bankNameCode: any;
    selectedProfile;
    cities;
    submitBtn = false;
    isEdit: boolean;
    fileName: any;
    // percentage: number;

    ngOnInit(): void {

        // if((this.bankDetailsForm.valid) && (this.bankDetails.state.id > 0)){
        //     this.submitBtn=true;
        // }
        this.cancelledChequeDeleted = false;
        this.bankDetails = {
            accountHolderName: '',
            bank: null,
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            cancelledChequePhotoImage: '',
            userDomain: ConfigurationConstants.USER_TYPE,
        }

        this.bankDetails.companyId = this._userService.selectedProfile.companyId;
        this.bankDetails.userDomain = ConfigurationConstants.USER_TYPE;
        this.selectedProfile = this._userService.selectedProfile;

        this._activatedRout.params.subscribe(params => {
            // this.bankDetails.addressCategory = params.type.toUpperCase();

        });

        this._activatedRout.url.subscribe(url => {
            this.isEdit = url[1].path == 'edit';

            if (url[1].path == 'edit' && this._userService.bankDetailsToEdit) {
                this.bankDetails = this._userService.bankDetailsToEdit;
            }
        })

        this._userService.getBankName().then(res => {
            if (res.data) {
                this.bankNames = res.data;
            }
        });



        this.bankDetailsForm = this._formBuilder.group({
            accountHolderName: [this.bankDetails.accountHolderName, Validators.required],
            bankName: [{ value: (this.bankDetails.bankName ? this.bankDetails.bank.code : '') }, Validators.required],
            accountNumber: [this.bankDetails.accountNumber, Validators.required],
            ifscCode: [this.bankDetails.ifscCode, Validators.required],
            cancelledChequePhotoImage: [this.bankDetails.cancelledChequePhotoImage]
        });

        if (this.isEdit) {
            this.bankDetailsForm.get('bankName').setValue(this.bankDetails.bank.code);
        }
    }

    onFileSelected(event) {
        if (event.target.files.length > 0) {
            this.fileName = event.target.files[0].name;
            const file = event.target.files[0];
            this.bankDetailsForm.get('cancelledChequePhotoImage').setValue(file);

        }
    }
    deleteCancelledCheque() {

        this._userService.deleteCancelledChequeAPI(this.bankDetails.id).then(res => {
            if (res.data.success) {
                this.cancelledChequeDeleted = true;
                this.bankDetails.cancelledChequePhotoImage = '';
            }
        });
    }

    submit() {
        if (this.bankDetailsForm.valid) {

            const defaults: any = {
                userDomain: ConfigurationConstants.USER_TYPE,
            };

            const data = Object.assign(this.bankDetailsForm.value, defaults);

            if (this.isEdit) {
                this._userService.editBankDetails(this.bankDetails.id, data).then(res => {
                    if (res.success) {
                        this.goToBankDetailsPage();

                    }
                });

            } else {
                this._userService.addBankDetails(data).then(res => {
                    if (res.success) {
                        this._userService.getUserPercentage().then(res => this._userService.updatePercentage$.next(res));
                        this.goToBankDetailsPage();
                    }
                });
            }
        }
        else {
            FormHelper.validateAllFormFields(this.bankDetailsForm);
        }

    }

    /**
    *  @description: this function is used to cancel the billing/deliveryRange address after editing
    */

    goToBankDetailsPage() {
        this._router.navigate([`/user/profile/bank-details`]);
    }

    changeBank(event) {

        for (let i = 0; i < this.bankNames.length; i++) {
            if (this.bankNames[i].code === event.value) {
                this.ifscPrefix = this.bankNames[i].ifscPrefix;
            }
        }
        this.bankDetailsForm.get('ifscCode').setValue(this.ifscPrefix);
    }
}