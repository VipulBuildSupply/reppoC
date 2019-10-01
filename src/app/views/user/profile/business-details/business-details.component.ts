import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from 'src/app/shared/models/category';
import { BusinessDetails, State, City, Address } from 'src/app/shared/models/address';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldRegExConst, ConfigurationConstants } from 'src/app/shared/constants';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'app-business-details',
    templateUrl: './business-details.component.html'
})
export class BusinessDetailsComponent implements OnInit {

    user: UserModel;
    turnovers: any;
    businessType: any;
    categoryNames: any;
    categoriesList: Category[];
    selectedIds: any[] = [];
    categoryErr: boolean = false;
    businessDetailsForm: FormGroup;
    businessDetails: BusinessDetails;
    cities;
    states;
    addressProofFiles: any;
    panPhotoImage: any;
    data: any;
    _isEdit: boolean = false;
    userVerified: any;

    constructor(private _userService: UserService,
        private _categoryService: CategoryService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        this.businessDetails = new BusinessDetails(this._activatedRoute.snapshot.data.business);
        this.getAnnualTurnover();
        this.getBusinessType();

        /**
         * @description get selected category lists
         */
        this._categoryService.getCatalogueCategories().then(res => {
            this.categoryNames = res.data;
            this.getCategoriesList(this.categoryNames);
        });
        
        if (this._router.url != '/user/profile/business-details/edit') {
            this._userService.isEdit = false;
            // this.isEdit  = false;
            this.formInit();
        }
        
        this._isEdit = this._userService.isEdit;
    
        if (this._router.url === '/user/profile/business-details/edit' && !this._isEdit) {
            this._router.navigate(['/user/profile/business-details']);
        }

        this.formInit();

        /**
         * @description to check if business details form submitted or not 
         * (by checking the condition - gstin exists or not)
         */
        if(this.businessDetails.gstin){
            this._userService.enableProfile$.next(true);
        }

        this._userService.getUserData().then(res => {
            this.userVerified = res.sellerPersonalProfile.verifyStatus;
        });
    }

    getAnnualTurnover(){
        this._userService.annualTurnovers().then((res: any) => {
            this.turnovers = res;
        }, (err: any) => { });
    }

    getBusinessType(){
        this._userService.businessType().then((res: any) => {
            this.businessType = res;
        });
    }

    /**
     * @description function to generate form controls and set values in it
     */
    formInit() {

        this.businessDetailsForm = this._formBuilder.group({

            sellerBusinessType: [{
                value: this.businessDetails.sellerBusinessType ? this.businessDetails.sellerBusinessType.code : '',
                disabled: !(this._isEdit)
            },{
                validators: [ Validators.required ]
            }],

            companyName: [{
                value: this.businessDetails.companyName,
                disabled: !(this._isEdit)
            }, {
                validators: [ Validators.required ]
            }],

            minAnnualTurnover: [{
                value: this.businessDetails.minAnnualTurnover ? this.businessDetails.minAnnualTurnover.code : '',
                disabled: !(this._isEdit)
            },{
                validators: [ Validators.required ]
            }],

            addressLine1: [{
                value: this.businessDetails.address ? this.businessDetails.address.addressLine1 : '',
                disabled: !(this._isEdit)
            }, {
                validators: [ Validators.required ]
            }],

            addressLine2: [{
                value: this.businessDetails.address ? this.businessDetails.address.addressLine2 : '',
                disabled: !(this._isEdit)
            }],

            cityId: [this.businessDetails.address.city ? this.businessDetails.address.city.id : null,
                Validators.required
            ],

            stateId: [this.businessDetails.address.state ? this.businessDetails.address.state.id : null,
                Validators.required
            ],

            phoneNo: [{
                value: this.businessDetails.address ? this.businessDetails.address.phoneNo : '',
                disabled: !(this._isEdit)
            }, {
                validators: [
                    Validators.pattern(FieldRegExConst.PHONE),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.required
                ]
            }],

            pincode: [{
                value: this.businessDetails.address ? this.businessDetails.address.pincode : '',
                disabled: !(this._isEdit)
            }, {
                validators: [
                    Validators.required,
                    Validators.pattern(FieldRegExConst.PINCODE),
                    Validators.minLength(6),
                    Validators.maxLength(6)
                ]
            }],

            gstin: [{
                value: this.businessDetails.gstin,
                disabled: !(this._isEdit)
            }, {
                validators: [
                    Validators.required,
                    Validators.pattern(FieldRegExConst.GSTIN)
                ]
            }],

            // addressProof: [''],

            addressProof: [
                this.businessDetails.addressProof ? this.businessDetails.addressProof : '',
            ],

            panPhoto: [this.businessDetails.panPhoto ? this.businessDetails.panPhoto : ''],
            
            panNo: [{
                value: this.businessDetails.panNo,
                disabled: !(this._isEdit)
            }, {
                validators: [
                    Validators.required,
                    Validators.pattern(FieldRegExConst.PANNO)
                ]
            }],

            categoryIds: [this.businessDetails.categoryIds]
        });        
    }

    edit() {
        this._userService.isEdit = true;
        this._router.navigate(['/user/profile/business-details/edit']);
    }

    /**
     * @description function to return all categories list and also selected categories list
     */
    getCategoriesList(selectedCatList) {
        this._categoryService.getCategories().then((res: any) => {
            this.categoriesList = res.data;
            selectedCatList.map(selectId => this.selectedIds.push(selectId.categoryId));
            if (selectedCatList) {
                this.categoriesList.map(allCatIds => {
                    if (this.selectedIds.indexOf(allCatIds.id) !== -1) {
                        allCatIds.isSelected = true;
                    }
                });
            }
            this.businessDetailsForm.get('categoryIds').setValue(this.selectedIds);
            return this.categoriesList;
        });
    }

    updateMuliselect(name, items) {
        const categoryIds = items.map(cat => cat.id);
        this.businessDetailsForm.get('categoryIds').setValue(categoryIds);
    }

    /**
     * @description function will call when new catalogue category selected
     */
    updateCategory(selectedCategory) {
        this.updateMuliselect('categoryList', selectedCategory);
    }

    /**
     * @description function to validate pincode on basis of city and state id
     */
    validatePincode(e) {
        if (e.target.value.length == 6) {
            this._userService.getPincode(e.target.value).then(res => {
                if(res.data) {
                    this.businessDetailsForm.get('cityId').setValue(res.data.cityId);
                    this.businessDetailsForm.get('stateId').setValue(res.data.stateId);
                    this.businessDetails.address.state.name = res.data.state;
                    this.businessDetails.address.city.name = res.data.city;
                }
            })
        }
        else {
            if(!this.businessDetails.address.state == undefined && !this.businessDetails.address.city == undefined){    
                this.businessDetails.address.state.name = "";
                this.businessDetails.address.city.name = "";
            }
        }
    }

    /**
     * @description function to display city based on state id
     */
    getCities(stateId) {
        this._userService.getCities(stateId).then(res => {
            this.cities = res.data;
        })
    }

    /**
     * @description function to validate gstin
     */
    validateGstin(e) {
        if (e.target.value) {
            this.businessDetailsForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);
        }
    }

    /**
     * @description function to validate gstin number if we paste gstin number
     */
    onPaste(event: ClipboardEvent) {
        let clipboardData = event.clipboardData;
        let pastedText = clipboardData.getData('text');
        let e = {
            target: {
                value: pastedText
            }
        }
        this.validateGstin(e);
    }

    /**
     * @description function work for file upolading process
     */
    onFileSelected(event) {
        if (event.target.files.length > 0) {
            this.addressProofFiles = event.target.files[0].name;
            const file = event.target.files[0];
            this.businessDetailsForm.get('addressProof').setValue(file);
        }
    }

    onPhotoSelected(event) {
        if (event.target.files.length > 0) {
            this.panPhotoImage = event.target.files[0].name;
            const file = event.target.files[0];
            this.businessDetailsForm.get('panPhoto').setValue(file);
        }
    }

    delete(){
        this.businessDetails.panPhoto = '';
        this.businessDetailsForm.value.panPhoto = '';
    }

    deleteAddressProof(id: number): void{

        console.log(id);
        

        // this._userService.deleteAddressProof(id).then(res => console.log(this.businessDetails));
    }

    /**
     * @description function to submit busisness details form
     */
    submit(e) {
        e.preventDefault();
        if (this.businessDetailsForm.valid) {            
            const address = new Address(this.businessDetailsForm.value as any);            
            const data = this.businessDetailsForm.value;
            delete data.addressLine1;
            delete data.addressLine2;
            delete data.cityId;
            delete data.stateId;
            delete data.phoneNo;
            delete data.pincode;
            delete data.addressCategory;
            delete data.userType;
            delete address.city;
            delete address.state;
            data.address = address;
            this.submitBusinessAddress(data);
        }
        else {
            FormHelper.validateAllFormFields(this.businessDetailsForm);
        }
    }


    submitBusinessAddress(data){
        this._userService.updateBusinessDetails(data).then(res => {
            if (res.status == 1001) {

                this.goToBusinessDetailsPage();
                
            }
        });
    }

    downloadpanProof(proofImage){
        var win = window.open(proofImage, '_blank');
        win.focus();
    }

    /**
    *  @description: this function is used to cancel the business details after editing
    */
    goToBusinessDetailsPage() {
        this._router.navigate([`/user/profile/business-details`]);
    }
}