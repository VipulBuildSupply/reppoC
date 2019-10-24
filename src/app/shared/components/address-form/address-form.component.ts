import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Address } from 'src/app/shared/models/address';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { FieldRegExConst, ConfigurationConstants } from 'src/app/shared/constants';
import { Subscription } from 'rxjs';
import { FormHelper } from '../../helpers/form-helper';

@Component({
    selector: 'app-address-form',
    templateUrl: './address-form.component.html'
})
export class AddressFormComponent implements OnInit, OnDestroy {

    @Output('submitForm') submitForm = new EventEmitter();
    @Input('isNonProfile') isNonProfile: boolean;

    @Output('onCancel') onCancel = new EventEmitter();

    subscriptions: Subscription[] = [];

    constructor(private _formBuilder: FormBuilder,
        private _activatedRout: ActivatedRoute,
        private _router: Router,
        private _userService: UserService) { }

    addressForm: FormGroup;
    //selectedProfile;
    addrs: Address;
    asdeliveryRangeAddress: false;
    additionalAddress;
    states;
    cities;
    submitBtn = false;
    isEdit: boolean;
    fileName: any;


    ngOnInit(): void {

        this.fileName = null;
        this.addrs = {
            addressLine1: '',
            addressLine2: '',
            companyId: '',
            defaultAddress: false,
            gstHolderName: '',
            gstin: '',
            name: '',
            phoneNo: '',
            pincode: '',
            deliveryRange: '',
            addressProof: '',
            userType: ConfigurationConstants.USER_TYPE,
            state: { name: '', id: 0 },
            city: { name: '', id: 0 },
            addressCategory: '',
        }

        /** 
        * @desc: if this component use to get address as text only then 
        * we dont need to start any subscription
        */
        if (!this.isNonProfile) {

            this.startSubscriptions();
        }



        // this.states = this._activatedRout.snapshot.data.states
        //  this.addrs.companyId = this._userService.selectedProfile.companyId;
        this.addrs.userType = ConfigurationConstants.USER_TYPE;
        //  this.selectedProfile = this._userService.selectedProfile

        this.formInit();
        this.checkGstin();

    }

    startSubscriptions() {
        this.subscriptions.push(
            this._activatedRout.params.subscribe(params => {
                this.addrs.addressCategory = params.type.toUpperCase();
            }),
            this._activatedRout.url.subscribe(url => {
                this.isEdit = url[2].path == 'edit';
                if (url[2].path == 'edit' && this._userService.addressToEdit) {
                    this.addrs = this._userService.addressToEdit;
                }
            })
        );
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(subs => subs.unsubscribe());
    }

    onFileSelected(event) {
        if (event.target.files.length > 0) {
            // console.log(event.target.files[0].name);
            this.fileName = event.target.files[0].name;
            const file = event.target.files[0];
            this.addressForm.get('addressProof').setValue(file);

        }
    }


    formInit() {
        this.addressForm = this._formBuilder.group({
            gstHolderName: [this.addrs.name, Validators.required],
            addressLine1: [this.addrs.addressLine1, Validators.required],
            addressLine2: [this.addrs.addressLine2],
            cityId: [this.addrs.city.id, Validators.required],
            defaultAddress: [this.addrs.defaultAddress],
            phoneNo: [this.addrs.phoneNo, {
                validators: [
                    Validators.pattern(FieldRegExConst.PHONE),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.required
                ]
            }],
            gstin: [this.addrs.gstin, {
                validators: [
                    Validators.pattern(FieldRegExConst.GSTIN)
                ]
            }],
            pincode: [this.addrs.pincode, {
                validators: [
                    Validators.required,
                    Validators.pattern(FieldRegExConst.PINCODE),
                    Validators.minLength(6),
                    Validators.maxLength(6)
                ]
            }],
            stateId: [this.addrs.state.id, Validators.required],
            deliveryRange: [this.addrs.deliveryRange],
            addressProof: [this.addrs.addressProof],
            isAdditionalAddress: [false]
        });
    }

    validatePincode(e) {
        if (e.target.value.length == 6) {
            this._userService.getPincode(e.target.value).then(res => {
                if (res.data) {
                    this.addressForm.get('cityId').setValue(res.data.cityId)
                    this.addressForm.get('stateId').setValue(res.data.stateId)
                    this.addrs.state.name = res.data.state;
                    this.addrs.city.name = res.data.city;
                }
            })
            // = res.data
        }
        else {
            this.addrs.state.name = "";
            this.addrs.city.name = "";
        }
    }

    checkGstin() {
        if (this.isNonProfile) {
            if (this.addrs.addressCategory == 'billing' || this.addressForm.get('isAdditionalAddress').value == true) {
                this.addressForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);

            } else {
                this.addressForm.get('gstin').clearValidators();
                this.addressForm.get('gstin').updateValueAndValidity();
            }
        }
    }

    checkdeliveryRange() {
        if (this.isNonProfile) {
            if (this.addrs.addressCategory == 'Warehouse' || this.addressForm.get('isAdditionalAddress').value == true) {
                this.addressForm.get('deliveryRange').setValidators([Validators.required]);

            } else {
                this.addressForm.get('deliveryRange').clearValidators();
                this.addressForm.get('deliveryRange').updateValueAndValidity();
            }
        }
    }


    getCities(stateId) {
        this._userService.getCities(stateId).then(res => {
            this.cities = res.data
        })
    }

    isAdditionalAddressClicked(e) {
        if (this.addrs.addressCategory === 'Warehouse') {
            if (e.target.checked) {
                this.addressForm.get('deliveryRange').setValidators([Validators.required]);

            } else {
                // this.addressForm.get('deliveryRange').setValue("");
                this.addressForm.get('deliveryRange').clearValidators();
                this.addressForm.get('deliveryRange').updateValueAndValidity();

            }
        }
        else if (this.addrs.addressCategory === 'billing') {
            if (e.target.checked) {
                this.addressForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);

            } else {
                // this.addressForm.get('gstin').setValue("");
                this.addressForm.get('gstin').clearValidators();
                this.addressForm.get('gstin').updateValueAndValidity();

            }
        }

    }

    validateGstin(e) {
        if (e.target.value) {
            this.addressForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);
        }
    }
    validatedeliveryRange(e) {
        if (e.target.value) {
            this.addressForm.get('deliveryRange').setValidators([Validators.required]);
        }
    }
    onPaste(event: ClipboardEvent) {
        let clipboardData = event.clipboardData; //|| window.clipboardData;
        let pastedText = clipboardData.getData('text');
        let e = {
            target: {
                value: pastedText
            }
        }
        this.validateGstin(e);
    }
    onPastedeliveryRange(event: ClipboardEvent) {
        let clipboardData = event.clipboardData; //|| window.clipboardData;
        let pastedText = clipboardData.getData('text');
        let e = {
            target: {
                value: pastedText
            }
        }
        this.validatedeliveryRange(e);
    }

    submit() {

        this.checkGstin();
        //return;
        if (this.addressForm.valid) {

            const defaults: any = {

                userType: ConfigurationConstants.USER_TYPE,
                addressCategory: this.addrs.addressCategory,
                additionalTypes: '',
                name: this.addressForm.value.gstHolderName
            };

            //if (this.selectedProfile.type == 'corporate') {
            // defaults.companyId = this.addrs.companyId;
            //}


            if (this.addressForm.get('isAdditionalAddress').value) {
                defaults.additionalTypes = this.addrs.addressCategory == "BILLING" ? "WAREHOUSE" : "BILLING";
            }

            const data = Object.assign(this.addressForm.value, defaults);

            if (!this.isNonProfile) {

                if (this.addrs.addressCategory !== 'BILLING' && this.addressForm.get('isAdditionalAddress').value !== true) {
                    delete data.gstin;
                }

                if (this.addrs.addressCategory !== 'WAREHOUSE' && this.addressForm.get('isAdditionalAddress').value !== true) {
                    delete data.deliveryRange;
                }

                if (this.isEdit) {
                    this.submitEditAddr(data);
                } else {
                    this.submitAddAddress(data);
                }
            } else {
                data.addressCategory = "PROJECT_ADDRESS";
                this.submitAddAddress(data);
                // this.submitForm.emit(Object.assign({}, this.addrs, data));
            }
        }
        else {
            FormHelper.validateAllFormFields(this.addressForm);
        }

    }

    submitAddAddress(data) {
        this._userService.addAddress(data).then(res => {
            if (res.success) {
                //this._router.navigate([ `/user/address/${this.addrs.addressCategory.toLowerCase()}` ])

                if (data.addressCategory == "PROJECT_ADDRESS") {
                    const newData = Object.assign({}, this.addrs, data, { addressId: res.id })
                    this.submitForm.emit(newData);
                } else {
                    this._userService.getUserPercentage().then(res => this._userService.updatePercentage$.next(res));
                    this.goToAddressPage();
                }
            }
        });
    }

    submitEditAddr(data) {
        this._userService.editAddress(this.addrs.addressId, data).then(res => {
            if (res.success) {
                //this._router.navigate([ `/user/address/${this.addrs.addressCategory.toLowerCase()}` ])
                this.goToAddressPage();
            }
        });
    }

    /**
    *  @description: this function is used to cancel the billing/deliveryRange address after editing
    */

    goToAddressPage() {

        if (this.isNonProfile) {
            this.onCancel.emit();
        } else {
            this._router.navigate([`/user/profile/address/${this.addrs.addressCategory.toLowerCase()}`])
        }
    }
}
