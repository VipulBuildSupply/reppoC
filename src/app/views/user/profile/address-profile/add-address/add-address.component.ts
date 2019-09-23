import { Component, OnInit } from '@angular/core';
import { Address } from 'src/app/shared/models/address';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldRegExConst, ConfigurationConstants } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';
import { FormHelper } from 'src/app/shared/helpers/form-helper';

@Component({
    selector: 'app-add-address',
    templateUrl: './add-address.component.html'
})
export class AddAddressComponent implements OnInit {
    constructor(private _formBuilder: FormBuilder,
        private _activatedRout: ActivatedRoute,
        private _router: Router,
        private _userService: UserService) { }

    addressForm: FormGroup;
    addrs: Address;
    selectedProfile;
    asdeliveryRangeAddress: false;
    additionalAddress;
   
    states;
    cities;
    submitBtn = false;
    isEdit: boolean;
        

    ngOnInit(): void {

        // if((this.addressForm.valid) && (this.addrs.state.id > 0)){
        //     this.submitBtn=true;
        // }

        this.addrs = {
            addressLine1: '',
            addressLine2: '',
            // cityId: '',
            companyId: '',
            defaultAddress: false,
            gstHolderName: '',
            deliveryRange : '',
            gstin: '',
            name: '',
            phoneNo: '',
            pincode: '',
            // stateId: '',
            userType: ConfigurationConstants.USER_TYPE,
            state: { name: '', id: 0 },
            city: { name: '', id: 0 },
            addressCategory: '',
        }


        this.states = this._activatedRout.snapshot.data.states
        this.addrs.companyId = this._userService.selectedProfile.companyId;
        this.addrs.userType = ConfigurationConstants.USER_TYPE;
        this.selectedProfile = this._userService.selectedProfile;

        this._activatedRout.params.subscribe(params => {
            this.addrs.addressCategory = params.type.toUpperCase();

        });

        this._activatedRout.url.subscribe(url => {
            this.isEdit = url[2].path == 'edit';

            if (url[2].path == 'edit' && this._userService.addressToEdit) {
                this.addrs = this._userService.addressToEdit;
            }
        })




        this.addressForm = this._formBuilder.group({
            gstHolderName: [this.addrs.name, Validators.required],
            addressLine1: [this.addrs.addressLine1, Validators.required],
            addressLine2: [this.addrs.addressLine2],
            cityId: [  this.addrs.city.id , Validators.required],
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
            deliveryRange:[this.addrs.deliveryRange],
            isAdditionalAddress: [false]
        });

        this.checkGstin();

    }

    ValidatePincode(e){
        if(e.target.value.length == 6)
        {
            this._userService.getPincode(e.target.value).then(res => {
                if (res.data) {


                    
                    this.addressForm.get('cityId').setValue( res.data.cityId)
                    this.addressForm.get('stateId').setValue( res.data.stateId)
                    this.addrs.state.name = res.data.state;
                    this.addrs.city.name = res.data.city;
                    // this.addrs.state.
                    // name = res.data.state;
                    // this.addrs.city.name = res.data.city;
                    // console.log(this.addrs.state.id + " -> " + this.addrs.city.id + "..."+this.addrs.state.name +".."+this.addrs.city.name);
                }
            })


            // = res.data
        }
        else{
            this.addrs.state.name = "";
            this.addrs.city.name = "";
        }
    }

    checkGstin() {
        if (this.addrs.addressCategory == 'billing' || this.addressForm.get('isAdditionalAddress').value == true) {
            this.addressForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);

        } else {
            this.addressForm.get('gstin').clearValidators();
            this.addressForm.get('gstin').updateValueAndValidity();
        }
    }


    getCities(stateId) {
        this._userService.getCities(stateId).then(res => {
            this.cities = res.data
        })
    }

    isAdditionalAddressClicked(e) {
        if (e.target.checked) {
            console.log("checked");
            this.addressForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);

        } else {
            console.log("UNchecked");
            // this.addressForm.get('gstin').setValue("");
            this.addressForm.get('gstin').clearValidators();
            this.addressForm.get('gstin').updateValueAndValidity();

        }
    }
    validateGstin(e){
        if(e.target.value){
            //console.log("hey");
            this.addressForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);
        }
    }
    onPaste(event: ClipboardEvent) {
        let clipboardData = event.clipboardData ; //|| window.clipboardData;
        let pastedText = clipboardData.getData('text');
        let e = {
            target:{
                value: pastedText
            }
        }
        this.validateGstin(e);
       }

    submit() {
        this.checkGstin();
        //return;
        if (this.addressForm.valid) {
            //console.log(this.addrs.state.id);

            const defaults: any = {

                userType: ConfigurationConstants.USER_TYPE,
                addressCategory: this.addrs.addressCategory,
                additionalTypes: '',
                name: this.addressForm.value.gstHolderName
            };

            if (this.selectedProfile.type == 'corporate') {
                // defaults.companyId = this.addrs.companyId;
            }


            if (this.addressForm.get('isAdditionalAddress').value) {
                defaults.additionalTypes = this.addrs.addressCategory == "BILLING" ? "WAREHOUSE" : "BILLING";
            }

            const data = Object.assign(this.addressForm.value, defaults);
            console.log(data);
            console.log(this.addrs.userType);

            if (this.addrs.addressCategory !== 'BILLING' && this.addressForm.get('isAdditionalAddress').value !== true) {
                delete data.gstin;
            }


            if (this.isEdit) {

                this._userService.editAddress(this.addrs.addressId, data).then(res => {
                    if (res.success) {
                        //this._router.navigate([ `/user/address/${this.addrs.addressCategory.toLowerCase()}` ])
                        this.goToAddressPage();
                    }
                });

            } else {
                this._userService.addAddress(data).then(res => {
                    if (res.success) {
                        //this._router.navigate([ `/user/address/${this.addrs.addressCategory.toLowerCase()}` ])
                        this.goToAddressPage();
                    }
                });
            }
        }
        else {
            FormHelper.validateAllFormFields(this.addressForm);
        }

    }

    /**
    *  @description: this function is used to cancel the billing/deliveryRange address after editing
    */

    goToAddressPage() {
        this._router.navigate([`/user/profile/address/${this.addrs.addressCategory.toLowerCase()}`])
    }
}
