import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Address, BankDetails } from 'src/app/shared/models/address';
import { ConfigurationConstants, FieldRegExConst } from 'src/app/shared/constants';
import { FormHelper } from 'src/app/shared/helpers/form-helper';

@Component({
    selector: 'app-add-bank-details',
    templateUrl: './add-bank-details.component.html'
})
export class AddBankDetailsComponent implements OnInit {
    constructor(private _formBuilder: FormBuilder,
        private _activatedRout: ActivatedRoute,
        private _router: Router,
        private _userService: UserService) { }

    bankDetailsForm: FormGroup;
    bankDetails: BankDetails;
   
    selectedProfile;
    cities;
    submitBtn = false;
    isEdit: boolean;
    fileName: any;

    ngOnInit(): void {

        // if((this.bankDetailsForm.valid) && (this.bankDetails.state.id > 0)){
        //     this.submitBtn=true;
        // }

        this.bankDetails = {
           accountHolderName : '',
           bankName : '',
           accountNumber : '',
           ifscCode : '',
           cancelledChequePhotoImage : '',
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




        this.bankDetailsForm = this._formBuilder.group({
            accountHolderName: [this.bankDetails.accountHolderName, Validators.required],
            bankName: [this.bankDetails.bankName, Validators.required],
            accountNumber: [this.bankDetails.accountNumber, Validators.required],
            ifscCode: [  this.bankDetails.ifscCode , Validators.required],
            cancelledChequePhotoImage:[this.bankDetails.cancelledChequePhotoImage]
        });

    }

    onFileSelected(event) {
        if (event.target.files.length > 0) {
          // console.log(event.target.files[0].name);
          this.fileName = event.target.files[0].name;
          const file = event.target.files[0];
          this.bankDetailsForm.get('cancelledChequePhotoImage').setValue(file);

        }
      }

    submit() {
       
        //return;
        if (this.bankDetailsForm.valid) {
            //console.log(this.bankDetails.state.id);

            const defaults: any = {

                userDomain: ConfigurationConstants.USER_TYPE,
            };

           
            const data = Object.assign(this.bankDetailsForm.value, defaults);
            // console.log(data);
            // console.log(this.bankDetails.userDomain);

            if (this.isEdit) {

                this._userService.editBankDetails(this.bankDetails.id, data).then(res => {
                    if (res.success) {
                        //this._router.navigate([ `/user/address/${this.bankDetails.addressCategory.toLowerCase()}` ])
                        this.goToBankDetailsPage();
                    }
                });

            } else {
                this._userService.addBankDetails(data).then(res => {
                    if (res.success) {
                        //this._router.navigate([ `/user/address/${this.bankDetails.addressCategory.toLowerCase()}` ])
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
}
