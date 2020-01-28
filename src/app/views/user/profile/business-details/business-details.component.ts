import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category, SelectedCategoryIds } from 'src/app/shared/models/category';
import { BusinessDetails, Address } from 'src/app/shared/models/address';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldRegExConst } from 'src/app/shared/constants';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { UserModel } from 'src/app/shared/models/user.model';
import { Turnovers, BusinessType } from 'src/app/shared/models/profile';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';

@Component({
    selector: 'app-business-details',
    templateUrl: './business-details.component.html'
})
export class BusinessDetailsComponent implements OnInit {

    user: UserModel;
    turnovers: Turnovers;
    businessType: BusinessType;
    selectedCategoryList: SelectedCategoryIds[];
    allCategoriesList: Category[];
    selectedIds: number[] = [];
    categoryErr: boolean = false;
    businessDetailsForm: FormGroup;
    businessDetails: BusinessDetails;
    cities;
    states;
    addressProofFiles: string;
    panPhotoImage: string;
    data: any;
    _isEdit: boolean = false;
    userVerified: string;
    othersInput: boolean;
    balanceSheets: FormArray;
    firstYear: string;
    secondYear: string;
    thirdYear: string;
    frightTerms: string;
    updatedCategories: any = {
        "itemList": [],
        "customCategories": []
    }
    @ViewChild('uploadAddressProof', { static: false }) uploadAddressProof: UploadComponent;
    @ViewChild('uploadPanProof', { static: false }) uploadPanProof: UploadComponent;
    @ViewChild('uploadGstCertificate', { static: false }) uploadGstCertificate: UploadComponent;
    @ViewChild('uploadbankAttachId', { static: false }) uploadbankStatement: UploadComponent;
    @ViewChildren('uploadBalanceSheets') uploadBalanceSheets: QueryList<UploadComponent>;
    addressProofDocs: FileList;

    constructor(private _userService: UserService,
        private _categoryService: CategoryService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        this.businessDetails = new BusinessDetails(this._activatedRoute.snapshot.data.business);
        debugger
        this.getAnnualTurnover();
        this.getBusinessType();
        this.getBalanceSheetYear();
        this.getFrightTerms();

        /**
         * @description get selected category lists
         */
        this._categoryService.getCatalogueCategories().then(res => {

            this.selectedCategoryList = res.data;

            this.selectedCategoryList.forEach(cat => {
                cat.categoryId = cat.categoryId ? cat.categoryId : cat.id;
                cat.name = cat.name ? cat.name : cat.categoryName;
                cat.isSelected = true;
            });

            this.getAllCategoriesList(this.selectedCategoryList);
        });

        if (this._router.url != '/user/profile/business-details/edit') {
            this._userService.isEdit = false;
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
        if (this.businessDetails.gstin) {
            this._userService.enableProfile$.next(true);
        }

        this._userService.getUserData().then(res => {
            this.userVerified = res.sellerPersonalProfile.verifyStatus;
        });
    }

    getBalanceSheetYear() {
        const d = new Date();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        if (month > 3) {
            this.firstYear = (year - 1) + '-' + year;
            this.secondYear = (year - 2) + '-' + (year - 1);
            this.thirdYear = (year - 3) + '-' + (year - 2);
        } else {
            this.firstYear = (year - 2) + '-' + (year - 1);
            this.secondYear = (year - 3) + '-' + (year - 2);
            this.thirdYear = (year - 4) + '-' + (year - 3);
        }
    }

    /**
     * @description Function to get all annual turnover data
     */
    getAnnualTurnover() {
        this._userService.annualTurnovers().then((res: any) => {
            this.turnovers = res;
        }, (err: any) => { });
    }

    /**
     * @description function to get all seller business types data
     */
    getBusinessType() {
        this._userService.businessType().then((res: any) => {
            this.businessType = res;
        });
    }

    /**
     * @description function to get all fright terms data
     */
    getFrightTerms(){
        this._userService.frightTerms().then((res: any) => {
            this.frightTerms = res;
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
            }, {
                validators: [Validators.required]
            }],

            companyName: [{
                value: this.businessDetails.companyName,
                disabled: !(this._isEdit)
            }, {
                validators: [Validators.required]
            }],

            minAnnualTurnover: [{
                value: this.businessDetails.minAnnualTurnover ? this.businessDetails.minAnnualTurnover.code : '',
                disabled: !(this._isEdit)
            }, {
                validators: [Validators.required]
            }],

            addressLine1: [{
                value: this.businessDetails.address ? this.businessDetails.address.addressLine1 : '',
                disabled: !(this._isEdit)
            }, {
                validators: [Validators.required]
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

            addressProofAttachId: [],

            panPhotoAttachId: [],

            panNo: [{
                value: this.businessDetails.panNo,
                disabled: !(this._isEdit)
            }, {
                validators: [
                    Validators.required,
                    Validators.pattern(FieldRegExConst.PANNO)
                ]
            }],

            categoryIds: [this.businessDetails.categoryIds],

            customCategories: [this.businessDetails.customCategories],

            gstCertificateAttachId: [''],

            bankStatementAttachId: [''],

            frightTermCd: [{
                value: this.businessDetails.frightTermCd ? this.businessDetails.frightTermCd : '',
                disabled: !(this._isEdit)
            }, {
                validators: [Validators.required]
            }],

            preferredTransporterName: [{
                value: this.businessDetails.preferredTransporterName,
                disabled: !(this._isEdit)
            }, {
                validators: [Validators.required]
            }],

            preferredTransporterPhone: [{
                value: this.businessDetails.preferredTransporterPhone,
                disabled: !(this._isEdit)
            }, {
                validators: [
                    Validators.pattern(FieldRegExConst.PHONE),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                    Validators.required
                ]
            }],

            balanceSheets: this._formBuilder.array([this.balanceSheetItem(this.firstYear),
            this.balanceSheetItem(this.secondYear), this.balanceSheetItem(this.thirdYear)])
        });
    }

    balanceSheetItem(y): FormGroup {
        return this._formBuilder.group({
            attachId: null,
            year: y
        });
    }

    /**
     * @description function is used to edit business details
     */
    edit() {
        this._userService.isEdit = true;
        this._router.navigate(['/user/profile/business-details/edit']);
    }

    /**
     * @description function to return all categories list and also selected categories list
     */
    getAllCategoriesList(selectedCatList) {
        this._categoryService.getCategories().then((res: any) => {
            const list = res.data;

            selectedCatList.forEach(selectedCat => {

                const existingCatIndex = list.findIndex(cat => cat.id == selectedCat.categoryId);

                if (existingCatIndex >= 0) {
                    list[existingCatIndex].isSelected = true;
                }
                if (selectedCat.id == selectedCat.categoryId) {
                    // only custom category
                    list.push(selectedCat);
                }

            });

            this.allCategoriesList = list;
            this.allCategoriesList.push({ id: 0, name: 'Others', categoryId: 0, categoryName: 'Others' });
            this.updateCatIds(this.allCategoriesList.filter(cat => cat.isSelected));
            return this.allCategoriesList;
        });
    }

    /**
     * @description function to update multiple categories and set these id's
     */

    updateCatIds(items) {
        const selectedIds = items.filter(selectedCat => selectedCat.id != selectedCat.categoryId && selectedCat.id != 0).map(cat => cat.id);
        const selectedCustomCat = items.filter(selectedCat => selectedCat.id == selectedCat.categoryId && selectedCat.id != 0).map(cat => cat.categoryName);

        this.othersInput = items.some(otherCat => otherCat.id == 0);

        if (this.othersInput) {
            this.businessDetailsForm.addControl('othersCategoryName', new FormControl('', Validators.required));
        } else {
            this.businessDetailsForm.removeControl('othersCategoryName');
        }

        this.businessDetailsForm.get('categoryIds').setValue(selectedIds);
        this.businessDetailsForm.get('customCategories').setValue(selectedCustomCat);
    }

    /**
     * @description function will call when new catalogue category selected
     */
    updateCategory(selectedCategory) {
        this.updateCatIds(selectedCategory);
    }

    /**
     * @description function to validate pincode on basis of city and state id
     */
    validatePincode(e) {
        if (e.target.value.length == 6) {
            this._userService.getPincode(e.target.value).then(res => {
                if (res.data) {
                    this.businessDetailsForm.get('cityId').setValue(res.data.cityId);
                    this.businessDetailsForm.get('stateId').setValue(res.data.stateId);
                    this.businessDetails.address.state.name = res.data.state;
                    this.businessDetails.address.city.name = res.data.city;
                }
            })
        }
        else {
            if (!this.businessDetails.address.state == undefined && !this.businessDetails.address.city == undefined) {
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
     * @description function to validate gstin number
     */
    validateGstin(e) {
        if (e.target.value) {
            this.businessDetailsForm.get('gstin').setValidators([Validators.required, Validators.pattern(FieldRegExConst.GSTIN)]);
        }
    }

    /**
     * @description function to validate gstin number if someone paste gstin number rather than type
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
     * @description function works for address proof file upolad
     */
    /*onFileSelected(event) {
        if (event.target.files.length > 0) {
            this.addressProofFiles = event.target.files[0].name;
            const file = event.target.files[0];
            this.businessDetailsForm.get('addressProof').setValue(file);
        }
    }*/

    /**
     * @description function works for pan proof file upload
     */
    /*onPhotoSelected(event) {
        if (event.target.files.length > 0) {
            this.panPhotoImage = event.target.files[0].name;
            const file = event.target.files[0];
            this.businessDetailsForm.get('panPhoto').setValue(file);
        }
    }*/

    /**
     * @description function is used to remove existed address proof document
     */
    /*delete() {
        this.businessDetails.panPhoto = '';
        this.businessDetailsForm.value.panPhoto = '';
    }*/


    /**
     * @description function is used to delete existed pan proof photo from api
     */
    /*deleteAddressProof(id: number): void {
        this._userService.deleteAddressProof(id).then(res => {
            this.businessDetails.address.addressProofFile = '';
        });
    }*/

    /**
     * @description function will get uploaded document's attach Id
     */
    getAttachIds(): Promise<any> {
        const docs: Promise<any>[] = [this.uploadAddressProof.uploadDocs('ADDRESS_PROOF'),
        this.uploadPanProof.uploadDocs('PAN_PHOTO'),
        this.uploadGstCertificate.uploadDocs('GST_CERTIFICATE'),
        this.uploadbankStatement.uploadDocs('BANK_STATEMENT'),
        ...this.uploadBalanceSheets.map(comp => comp.uploadDocs('BALANCE_SHEET'))];
        return Promise.all(docs);
    }

    /**
     * @description function to submit business details form
     */
    submit(e) {
        e.preventDefault();

        this.getAttachIds().then(ids => {
            if (this.businessDetailsForm.valid) {
                const address = new Address(this.businessDetailsForm.value as any);
                let data = this.businessDetailsForm.value;
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
                if (data.othersCategoryName) {
                    data.customCategories.push(data.othersCategoryName);
                    delete data.othersCategoryName;
                }

                data.address = address;
                data.address.addressProofAttachId = ids[0];
                data.panPhotoAttachId = ids[1];
                data.gstCertificateAttachId = ids[2];
                data.bankStatementAttachId = ids[3];                
                data.balanceSheets[0].attachId = ids[4];
                data.balanceSheets[1].attachId = ids[5];
                data.balanceSheets[2].attachId = ids[6];
                
                this.submitBusinessAddress(data);
            }
            else {
                FormHelper.validateAllFormFields(this.businessDetailsForm);
            }
        });
    }


    /**
     * @description function to submit and update business details data
     */
    submitBusinessAddress(data) {
        this._userService.updateBusinessDetails(data).then(res => {
            if (res.status == 1001) {
                this._userService.getUserPercentage().then(res => this._userService.updatePercentage$.next(res));
                this.goToBusinessDetailsPage();
            }
        });
    }

    /**
     * @description function to download attached documents
     */
    downloadpanProof(docLink) {
        var win = window.open(docLink, '_blank');
        win.focus();
    }

    addressProofUpdate(files: FileList) {
        this.addressProofDocs = files;
        debugger
    }

    /**
    *  @description: this function is used to cancel the business details after editing
    */
    goToBusinessDetailsPage() {
        this._router.navigate([`/user/profile/business-details`]);
    }
}