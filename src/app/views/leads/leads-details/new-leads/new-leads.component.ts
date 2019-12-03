import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SendBulkCatalogueEmailComponent } from 'src/app/shared/dialogs/send-bulk-catalogue-email/send-bulk-catalogue-email.component';
import { CatalogueFiltersComponent } from 'src/app/shared/dialogs/catalogue-filters/catalogue-filters.component';
import { DataService } from 'src/app/shared/services/data.service';
import { of } from 'rxjs';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';
interface Warehouse {
  address: any;
  pricingForms: FormGroup[]
}

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html'
})

export class NewLeadComponent implements OnInit {
  minDate = new Date();
  datePickerValue: any;
  isEditBtnClicked: boolean;
  catalogueList: any;
  catalogueListTemp: any;
  uniqueCatalogueData: any;
  pricingForm: FormGroup;
  docs: FileList;
  addPriceToAllWareHouseCheckBox: boolean;
  addPriceForRemainingQuantity: boolean;
  addPriceForRemainingIndividualQuantity: boolean[] = [];
  minValuesQty: number[] = [];
  maxValuesQty: number[] = [];
  pricingForms: FormGroup[] = [];
  pricingFormsIndividual: FormGroup[][] = [];
  editPricingAllForms: FormGroup[] = [];
  sendPricingToAllArray: any[] = [];
  sendPricingToAllArrayEdit: any[] = [];
  sendPricingToIndividualArrayAdd: any[] = [];
  warehouseData: Warehouse[] = [];
  subscriptions: Subscription[] = [];
  editMinMaxIsFalse: boolean;
  minMaxValidValue: boolean;
  addPriceForRemainingIndividualQuantityNumber: any[] = [];
  checkPriceValidate: boolean;
  AllIndividualForms: boolean;
  selectedFilters: any;
  message: string;
  submitQuoteMsg: string;
  paymentTermCode: string;
  paymentterms: any;
  leadPaymentForm: FormGroup;
  sequenceId: any;
  private routeSub: Subscription;
  leadId: number;
  wareHouseAdd: any;
  showLeadObjDetails: any;
  showLeadObjDetailsTemp: any;
  checkQuoteWarehouse: boolean;
  addPriceToAllWareHouseCheckBoxCheck: boolean;
  warehouseHasPricing: boolean;
  datePickerValueLeads: any;
  openTextBoxPayment: boolean;
  activeLeadId: number;
  activeLeadStatus: boolean;
  notes: string;

  @ViewChild('upload', { static: false }) upload: UploadComponent;

  constructor(private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog,
    private snack: MatSnackBar,
    private data: DataService,
    private ref: ChangeDetectorRef,
    private _categoryService: CategoryService,
    private Userservice: UserService) {

  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.leadId = params['id'];

      this.addPriceToAllWareHouseCheckBoxCheck = true;
      this.pricingForms = [];
      this.editPricingAllForms = [];

      this.startSubscriptions();

      this.Userservice.showPaymentTerms().then(res => {
        this.paymentterms = res.data;
      });

      this.getLeadObj(this.leadId);
      this.paymentForm();


    });

  }

  startSubscriptions() {
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.activeLeadId = parseInt(params.id);
      }),

      this.data.currentMessage.subscribe(message => this.message = message),
      this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  paymentForm() {

    this.leadPaymentForm = this._formBuilder.group({
      //  PaymentTerm: new FormControl(this.paymentTermCode, Validators.required),
      //   PaymentInput: [{ value: (this.paymentTermCode ? '' : this.showLeadObjDetails.data.request.sellerPaymentTerm) }]
      // PaymentInput: new FormControl(this.openTextBoxPayment ? this.showLeadObjDetails.data.request.sellerPaymentTerm : '')
      PaymentTerm: new FormControl(),
      PaymentInput: new FormControl()
    });
  }

  getLeadObj(leadId) {
    this.docs = null;
    this.openTextBoxPayment = false;
    this.editMinMaxIsFalse = false;
    this.paymentTermCode = null;
    this.AllIndividualForms = false;
    this.isEditBtnClicked = false;
    this.checkPriceValidate = false;
    this.minMaxValidValue = true;
    this.editMinMaxIsFalse = false;
    this.addPriceForRemainingIndividualQuantity = [];
    this.addPriceToAllWareHouseCheckBox = false;
    this.addPriceForRemainingQuantity = false;
    this.addPriceForRemainingIndividualQuantityNumber = [];
    this.sendPricingToIndividualArrayAdd = [];
    this.pricingForms = [];
    this.pricingFormsIndividual = [];
    this.editPricingAllForms = [];
    this.sendPricingToAllArray = [];
    this.sendPricingToAllArrayEdit = [];
    this.sendPricingToIndividualArrayAdd = [];
    this.addAnotherRange();

    this.Userservice.getLeadObj(leadId).then(res => {



      this.showLeadObjDetails = res;
      this.showLeadObjDetailsTemp = res;
      this.activeLeadStatus = this.activeLeadId === this.showLeadObjDetails.data.request.id ? this.showLeadObjDetails.data.request.expired : false;
      this.warehouseData = [];

      if (this.showLeadObjDetails.data.request.sellerPaymentTerm) {
        this.Userservice.showPaymentTerms().then(res => {
          this.paymentterms = res.data;
          const terms = this.showLeadObjDetails.data.request.sellerPaymentTerm;
          for (let i = 0; i < this.paymentterms.length; i++) {
            if (this.paymentterms[i].displayName == terms) {
              this.paymentTermCode = this.paymentterms[i].code;
              this.openTextBoxPayment = false;
            }
          }
          if (this.paymentTermCode == null) {
            this.paymentTermCode = 'bs.paymenterm.others';
            this.openTextBoxPayment = true;
          }
          this.leadPaymentForm.get('PaymentTerm').setValue(this.paymentTermCode);
          if (this.paymentTermCode = 'bs.paymenterm.others') {
            this.leadPaymentForm.get('PaymentInput').setValue(this.showLeadObjDetails.data.request.sellerPaymentTerm);
          }
        });
      }



      if (res.data.warehouseList && (res.data.warehouseList[0].warehousePriceList.length > 0) && (res.data.warehouseList[0].warehousePriceList[0].validEndDt)) {
        const day = res.data.warehouseList[0].warehousePriceList[0].validEndDt.substring(0, 2);
        const month = res.data.warehouseList[0].warehousePriceList[0].validEndDt.substring(3, 5);
        const year = res.data.warehouseList[0].warehousePriceList[0].validEndDt.substring(6, 10);
        const dateVal = month + "-" + day + "-" + year;
        this.datePickerValue = new FormControl(new Date(year, month - 1, day));
        this.datePickerValueLeads = dateVal;
      }

      this.createWarehouseData(this.showLeadObjDetails.data.warehouseList);

      if (this.showLeadObjDetails.data.request.samePriceAllWarehouse) {
        this.addPriceToAllWareHouseCheckBox = true;
      }


      if (this.showLeadObjDetails.data.warehouseList.length > 0) {
        if (this.showLeadObjDetails.data.warehouseList[0].warehousePriceList.length > 0) {
          this.editPricingAllForms = [];
          this.isEditBtnClicked = true;
          for (let i = 0; i < this.showLeadObjDetails.data.warehouseList[0].warehousePriceList.length; i++) {
            this.editPricingForms(i);
            this.isEditBtnClicked = true;
          }
        }
      }
      this.Userservice.getSequenceId().then(res => {
        if (res) {
          this.sequenceId = res.id;
        }
      })
      this.paymentForm();
      this.updateFileList();
    });

    // this.addAnotherRange();
  }

  updateFileList() {
    if (this.upload) {
      this.upload.blankFiles();
    }
  }

  paymentTermsSelect(event) {
    this.paymentTermCode = event.value;
    if (this.paymentTermCode === 'bs.paymenterm.others') {
      this.openTextBoxPayment = true;

      this.leadPaymentForm.get('PaymentInput').setValue(null);
    }
    else {
      this.leadPaymentForm.get('PaymentTerm').setValue(this.paymentTermCode);

      this.leadPaymentForm.get('PaymentInput').setValue(null);
      this.openTextBoxPayment = false;
    }
  }

  setOtherPaymentTerms(event) {
    this.paymentTermCode = event.target.value;
    this.leadPaymentForm.get('PaymentInput').setValue(this.paymentTermCode);
  }

  createWarehouseData(warehouselist) {

    warehouselist.forEach(warehouse => {

      const forms = [];

      if (warehouse.warehousePriceList.length) {

        warehouse.warehousePriceList.forEach(pricesItem => {

          forms.push(

            this._formBuilder.group({
              minPrice: [pricesItem.minQty, Validators.required],
              maxPrice: [pricesItem.maxQty],
              price: [pricesItem.price, Validators.required],
              check: ['']
            }, { validators: this.isMinMaxInValid })
          );
        });

      } else {
        // if no data in price List set on default price form
        forms.push(
          this._formBuilder.group({
            minPrice: ['', Validators.required],
            maxPrice: [''],
            price: ['', Validators.required],
            check: ['']
          }, { validators: this.isMinMaxInValid })
        );
      }
      this.warehouseData.push({
        address: warehouse.warehouseAddress,
        pricingForms: forms
      });
    });
  }

  deletePicingAllWarehouse(index) {
    this.pricingForms.splice(index, 1);
  }

  deletePicingAllWarehouseEdit(index) {
    this.editPricingAllForms.splice(index, 1);
  }

  addAnotherRange() {
    if (this.isEditBtnClicked) {
      this.editPricingAllForms.push(
        this._formBuilder.group({
          minPrice: [((this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.value != "") ? this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.value + 1 : ""), Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );

      if (this.addPriceForRemainingQuantity) {
        for (let i = 0; i < this.editPricingAllForms.length - 1; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
          if (this.editPricingAllForms[i].controls.maxPrice.value == 2147483647) {
            this.editPricingAllForms[i].controls.maxPrice.setValue(null);
            if (this.editPricingAllForms[i].controls.maxPrice.value == null) {
              this.minMaxValidValue = true;
            }
          }
        }
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.disable();
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.setValue(2147483647);
        if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.minPrice.value == null) {
          this.minMaxValidValue = true;
        }
        else if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.minPrice.value == "") {
          this.minMaxValidValue = true;
        }
        else {
          this.minMaxValidValue = false;
        }
      } else {

        if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.minPrice.value == null || this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.value == null) {
          this.minMaxValidValue = true;
        }
        else if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.minPrice.value == "" || this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.value == "") {
          this.minMaxValidValue = true;
        }
        else {
          this.minMaxValidValue = false;
        }
      }
      this.addPriceForRemainingIndividualQuantity = [];
    }
    else if (!this.isEditBtnClicked) {
      if (this.pricingForms.length >= 1) {
        this.pricingForms.push(
          this._formBuilder.group({
            minPrice: [((this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.value != "") ? this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.value + 1 : ""), Validators.required],
            maxPrice: [''],
            price: ['', Validators.required],
            check: ['']
          }, { validators: this.isMinMaxInValid })
        );
      } else if (this.pricingForms.length == 0) {
        this.pricingForms.push(
          this._formBuilder.group({
            minPrice: ['', Validators.required],
            maxPrice: [''],
            price: ['', Validators.required],
            check: ['']
          }, { validators: this.isMinMaxInValid })
        );
      }
      if (this.addPriceForRemainingQuantity) {
        for (let i = 0; i < this.pricingForms.length - 1; i++) {
          this.pricingForms[i].controls.maxPrice.enable();

          if (this.pricingForms[i].controls.maxPrice.value == 2147483647) {
            this.pricingForms[i].controls.maxPrice.setValue(null);
            if (this.pricingForms[i].controls.maxPrice.value == null) {
              this.minMaxValidValue = true;
            }
          }
        }
        this.addPriceForRemainingIndividualQuantity = [];
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.disable();
        if (this.pricingForms[this.pricingForms.length - 1].controls.minPrice.value == null) {
          this.minMaxValidValue = true;
        }
        else if (this.pricingForms[this.pricingForms.length - 1].controls.minPrice.value == "") {
          this.minMaxValidValue = true;
        }
        else {
          this.minMaxValidValue = false;
        }

      }
      else {
        if (this.pricingForms[this.pricingForms.length - 1].controls.minPrice.value == null || this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.value == null) {
          this.minMaxValidValue = true;
        }
        else if (this.pricingForms[this.pricingForms.length - 1].controls.minPrice.value == "" || this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.value == "") {
          this.minMaxValidValue = true;
        }
        else {
          this.minMaxValidValue = false;
        }
      }
    }
  }

  deletePicingIndividualWarehouse(form, index) {
    form.splice(index, 1);
  }

  addAnotherRangeIndividual(form, index) {
    if (this.isEditBtnClicked) {
      form.push(
        this._formBuilder.group({
          minPrice: [((form[form.length - 1].controls.maxPrice.value != "") ? form[form.length - 1].controls.maxPrice.value + 1 : ""), Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );

      if (this.addPriceForRemainingIndividualQuantity) {
        for (let i = 0; i < form.length - 1; i++) {
          form[i].controls.maxPrice.enable();
          if (form[i].controls.maxPrice.value == 2147483647) {
            form[i].controls.maxPrice.setValue(null);
            if (form[i].controls.maxPrice.value == null) {
              this.minMaxValidValue = true;
            }
          }
        }

        if ((this.addPriceForRemainingIndividualQuantityNumber[index] == index) && this.addPriceForRemainingQtyIndividualWarehouse[index]) {
          form[form.length - 1].controls.maxPrice.disable();
          form[form.length - 1].controls.maxPrice.setValue(2147483647);

          if (form[form.length - 1].controls.maxPrice.value == null) {
            this.minMaxValidValue = true;
          }
          else if (form[form.length - 1].controls.maxPrice.value == "") {
            this.minMaxValidValue = true;
          }
          else {
            this.minMaxValidValue = false;
          }


        }
      }
    }
    else if (!this.isEditBtnClicked) {
      form.push(
        this._formBuilder.group({
          minPrice: [((form[form.length - 1].controls.maxPrice.value != "") ? form[form.length - 1].controls.maxPrice.value + 1 : ""), Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );

      if (this.addPriceForRemainingIndividualQuantity) {
        for (let i = 0; i < form.length - 1; i++) {
          form[i].controls.maxPrice.enable();

          if ((form[i].controls.maxPrice.value) === 2147483647) {
            form[i].controls.maxPrice.setValue(null);
            if (form[i].controls.maxPrice.value == null) {
              this.minMaxValidValue = true;
            }
          }

        }
        if ((this.addPriceForRemainingIndividualQuantityNumber[index] == index) && (this.addPriceForRemainingIndividualQuantity[index])) {
          form[form.length - 1].controls.maxPrice.disable();
          form[form.length - 1].controls.maxPrice.setValue(2147483647);

          if (form[form.length - 1].controls.maxPrice.value == null) {
            this.minMaxValidValue = true;
          }
          else if (form[form.length - 1].controls.maxPrice.value == "") {
            this.minMaxValidValue = true;
          }
          else {
            this.minMaxValidValue = false;
          }
        }

      }
    }
  }

  editPricingForms(i: any) {
    this.editPricingAllForms.push(
      this._formBuilder.group({
        minPrice: [this.showLeadObjDetails.data.warehouseList[0].warehousePriceList[i].minQty, Validators.required],
        maxPrice: [this.showLeadObjDetails.data.warehouseList[0].warehousePriceList[i].maxQty],
        price: [this.showLeadObjDetails.data.warehouseList[0].warehousePriceList[i].price, Validators.required],
        check: ['']
      }, { validators: this.isMinMaxInValid })
    );
  }

  isMinMaxInValid(form: FormGroup) {
    const min = form.controls.minPrice.value;
    const max = form.controls.maxPrice.value;

    if (min != "" && max != "" && (Number(min) > Number(max))) {
      form.controls.minPrice.setErrors({ isMinMaxInValid: false });
      form.controls.maxPrice.setErrors({ isMinMaxInValid: false });
      form.controls.check.setErrors(null);
    }
    else if (min != "" && max == null && (Number(min) > Number(max))) {
      form.controls.minPrice.setErrors({ isMinMaxInValid: false });
      form.controls.maxPrice.setErrors({ isMinMaxInValid: false });
      form.controls.check.setErrors(null);
    } else if (min != "" && max != "" && (Number(min) < Number(max))) {
      form.controls.minPrice.setErrors(null);
      form.controls.maxPrice.setErrors(null);
      // form.controls.check.setErrors(null);
    }
    return { isMinMaxInValid: false };
  }

  checkPrice(currentFormIndex) {
    if (this.pricingForms[currentFormIndex].controls.minPrice.value < this.pricingForms[currentFormIndex].controls.maxPrice.value) {
      this.minMaxValidValue = false;
    }
    if (this.pricingForms[currentFormIndex].controls.price.value == null) {
      this.checkPriceValidate = true;
    }
    else if (this.pricingForms[currentFormIndex].controls.price.value == "") {

      this.checkPriceValidate = true;
    }
    else {
      this.checkPriceValidate = false;
    }
  }

  checkPriceEdit(currentFormIndex) {

    if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value < this.editPricingAllForms[currentFormIndex].controls.maxPrice.value) {
      this.minMaxValidValue = false;
    }

    if (this.editPricingAllForms[currentFormIndex].controls.price.value == null) {
      this.checkPriceValidate = true;
    }
    else if (this.editPricingAllForms[currentFormIndex].controls.price.value == "") {
      this.checkPriceValidate = true;
    }

    else {
      this.checkPriceValidate = false;
    }
  }

  checkPriceIndvidual(currentFormIndex, Index) {
    if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value < this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value) {
      this.minMaxValidValue = false;
    }


    if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.price.value == null) {

      this.checkPriceValidate = true;

    } else if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.price.value == "") {

      this.checkPriceValidate = true;
    }
    else {
      this.checkPriceValidate = false;
    }
  }

  datePicker(value) {
    this.datePickerValue = new FormControl(new Date(value));
    this.datePickerValueLeads = value.replace('/', '-');
    this.datePickerValueLeads = this.datePickerValueLeads.replace('/', '-');
  }

  addPriceForRemainingQty(event) {
    if (event.target.checked) {
      this.addPriceForRemainingQuantity = true;
      if (this.editPricingAllForms.length > 0) {
        for (let i = 0; i < this.editPricingAllForms.length - 1; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
        }
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.disable();
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.setValue(2147483647);
        if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.value == 2147483647) {
          if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.minPrice.value == null) {
            this.minMaxValidValue = true;
          }
          else if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.minPrice.value == "") {
            this.minMaxValidValue = true;
          }
          else {
            this.minMaxValidValue = false;
          }
        }
      }

      if (this.pricingForms.length > 0 && this.editPricingAllForms.length == 0) {
        for (let i = 0; i < this.pricingForms.length - 1; i++) {
          this.pricingForms[i].controls.maxPrice.enable();
        }
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.disable();
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.setValue(2147483647);
        if (this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.value == 2147483647) {
          if (this.pricingForms[this.pricingForms.length - 1].controls.minPrice.value == null) {
            this.minMaxValidValue = true;
          }
          else if (this.pricingForms[this.pricingForms.length - 1].controls.minPrice.value == "") {
            this.minMaxValidValue = true;
          }
          else {
            this.minMaxValidValue = false;
          }
        }
      }
    }
    else {
      this.addPriceForRemainingQuantity = false;
      if (this.editPricingAllForms.length > 0) {
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.setValue(null);
        if (this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.value == null) {
          this.minMaxValidValue = true;
        }
        for (let i = 0; i < this.editPricingAllForms.length; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
        }
      }

      if (this.pricingForms.length > 0) {
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.setValue(null);
        if (this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.value == null) {
          this.minMaxValidValue = true;
        }
        for (let i = 0; i < this.pricingForms.length; i++) {
          this.pricingForms[i].controls.maxPrice.enable();
        }
      }
    }
  }

  addPriceForRemainingQtyIndividualWarehouse(event, priceforms, index) {

    if (event.target.checked) {
      this.addPriceForRemainingIndividualQuantity[index] = true;
      this.addPriceForRemainingIndividualQuantityNumber[index] = index;

      for (let i = 0; i < priceforms.length - 1; i++) {
        this.warehouseData[index].pricingForms[i].controls.maxPrice.enable();
      }
      // this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.disable();
      this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.setValue(2147483647);
      if (this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.value == 2147483647) {
        if (this.warehouseData[index].pricingForms[priceforms.length - 1].controls.minPrice.value == null) {
          this.minMaxValidValue = true;
        }
        else if (this.warehouseData[index].pricingForms[priceforms.length - 1].controls.minPrice.value == "") {
          this.minMaxValidValue = true;
        }
        else {
          this.minMaxValidValue = false;
        }
      }

    } else {
      this.addPriceForRemainingIndividualQuantity[index] = false;
      this.addPriceForRemainingIndividualQuantityNumber[index] = 99999;
      this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.setValue(null);
      if (this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.value == null) {
        this.minMaxValidValue = true;
      }
      for (let i = 0; i < priceforms.length; i++) {
        this.warehouseData[index].pricingForms[i].controls.maxPrice.enable();
      }
    }
  }

  compareMinMaxIndvidual(currentFormIndex, Index) {

    if (currentFormIndex > 0) {
      if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value < this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.maxPrice.value) {
        this.editMinMaxIsFalse = true;
        this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.check.setErrors(null);
        this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.check.setErrors({ isMinMaxInValid: false });
      }
      else if (this.warehouseData[Index].pricingForms[currentFormIndex + 1]) {
        if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value > this.warehouseData[Index].pricingForms[currentFormIndex + 1].controls.minPrice.value) {
          this.editMinMaxIsFalse = true;
          this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
        }
        else {
          this.editMinMaxIsFalse = false;
          this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors(null);
        }
      }

      else {
        this.editMinMaxIsFalse = false;
        this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.check.setErrors(null);
      }


      if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value < this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value) {
        this.minMaxValidValue = true;
      }
      else {
        this.minMaxValidValue = false;
      }

    }

    else if (currentFormIndex == 0) {
      if (this.warehouseData[Index].pricingForms[currentFormIndex + 1]) {
        if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value > this.warehouseData[Index].pricingForms[currentFormIndex + 1].controls.minPrice.value) {
          this.editMinMaxIsFalse = true;
          this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors(null);
          this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
        } else {
          this.editMinMaxIsFalse = false;
          this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors(null);
        }
      }


      if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value < this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value) {
        this.minMaxValidValue = true;
      }
      else {
        this.minMaxValidValue = false;
      }

    }

    if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value == null) {
      this.minMaxValidValue = true;
    }
    else if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value == "") {
      this.minMaxValidValue = true;
    }

    for (let i = 0; i < this.warehouseData.length; i++) {
      for (let j = 0; j < this.warehouseData[i].pricingForms.length; j++) {
        if ((this.warehouseData[i].pricingForms[j].controls.maxPrice.value == 2147483647) && (this.addPriceForRemainingIndividualQuantity[i])) {
          if (this.warehouseData[i].pricingForms[j].controls.minPrice.value == null) {
            this.AllIndividualForms = true;
          }
          else if (this.warehouseData[i].pricingForms[j].controls.minPrice.value == "") {
            this.AllIndividualForms = true;
          }
          else {
            this.AllIndividualForms = false;
          }
        }
      }
    }

    this.checkPriceIndvidual(currentFormIndex, Index);

  }

  compareMinMax(currentFormIndex) {
    if (this.pricingForms) {

      if (currentFormIndex > 0) {
        if (this.pricingForms[currentFormIndex].controls.minPrice.value < this.pricingForms[currentFormIndex - 1].controls.maxPrice.value) {
          //   this.pricingForms[currentFormIndex - 1].controls.maxPrice.setErrors(null);
          this.editMinMaxIsFalse = true;
          this.pricingForms[currentFormIndex - 1].controls.check.setErrors({ isMinMaxInValid: false });
        }
        else if (this.pricingForms[currentFormIndex + 1]) {
          if (this.pricingForms[currentFormIndex].controls.maxPrice.value > this.pricingForms[currentFormIndex + 1].controls.minPrice.value) {
            this.editMinMaxIsFalse = true;
            this.pricingForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
          }
          else {
            this.editMinMaxIsFalse = false;
            this.pricingForms[currentFormIndex].controls.check.setErrors(null);
          }
        }
        else {
          this.editMinMaxIsFalse = false;
          this.pricingForms[currentFormIndex - 1].controls.check.setErrors(null);
        }
      }

      else if (currentFormIndex == 0) {
        if (this.pricingForms[currentFormIndex + 1]) {
          if (this.pricingForms[currentFormIndex].controls.maxPrice.value > this.pricingForms[currentFormIndex + 1].controls.minPrice.value) {
            //   this.pricingForms[currentFormIndex].controls.maxPrice.setErrors(null);
            this.editMinMaxIsFalse = true;
            this.pricingForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
          }
          else {
            this.editMinMaxIsFalse = false;
            this.pricingForms[currentFormIndex].controls.check.setErrors(null);
          }
        }
      }

      if (this.pricingForms[currentFormIndex].controls.minPrice.value > this.pricingForms[currentFormIndex].controls.maxPrice.value) {
        this.minMaxValidValue = true;
      } else {
        this.minMaxValidValue = false;
      }

      if (this.pricingForms[currentFormIndex].controls.minPrice.value == null) {
        this.minMaxValidValue = true;
      }
      else if (this.pricingForms[currentFormIndex].controls.minPrice.value == "") {
        this.minMaxValidValue = true;
      }

      this.checkPrice(currentFormIndex);
    }
  }

  compareMinMaxEdit(currentFormIndex) {
    if (this.editPricingAllForms) {

      if (currentFormIndex > 0) {
        if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value < this.editPricingAllForms[currentFormIndex - 1].controls.maxPrice.value) {
          //   this.editPricingAllForms[currentFormIndex - 1].controls.maxPrice.setErrors(null);
          this.editMinMaxIsFalse = true;
          this.editPricingAllForms[currentFormIndex - 1].controls.check.setErrors({ isMinMaxInValid: false });
        }
        else if (this.editPricingAllForms[currentFormIndex + 1]) {
          if (this.editPricingAllForms[currentFormIndex].controls.maxPrice.value > this.editPricingAllForms[currentFormIndex + 1].controls.minPrice.value) {
            this.editMinMaxIsFalse = true;
            this.editPricingAllForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
          }
          else {
            this.editMinMaxIsFalse = false;
            this.editPricingAllForms[currentFormIndex].controls.check.setErrors(null);
          }
        }
        else {
          this.editMinMaxIsFalse = false;
          this.editPricingAllForms[currentFormIndex - 1].controls.check.setErrors(null);
        }
      }

      else if (currentFormIndex == 0) {
        if (this.editPricingAllForms[currentFormIndex + 1]) {
          if (this.editPricingAllForms[currentFormIndex].controls.maxPrice.value > this.editPricingAllForms[currentFormIndex + 1].controls.minPrice.value) {
            //   this.editPricingAllForms[currentFormIndex].controls.maxPrice.setErrors(null);
            this.editMinMaxIsFalse = true;
            this.editPricingAllForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
          }
          else {
            this.editMinMaxIsFalse = false;
            this.editPricingAllForms[currentFormIndex].controls.check.setErrors(null);
          }
        }

      }

      if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value > this.editPricingAllForms[currentFormIndex].controls.maxPrice.value) {
        this.minMaxValidValue = true;

      } else {
        this.minMaxValidValue = false;
      }

      if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value == null) {
        this.minMaxValidValue = true;
      }
      else if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value == "") {
        this.minMaxValidValue = true;
      }

      this.checkPriceEdit(currentFormIndex);
    }
  }

  OnInput(event) {
    this.notes = event.value;
  }

  addPricingIndividualWarehouseAddress() {
    this.uploadDocs();
    this.sendPricingToIndividualArrayAdd = [];

    for (let i = 0; i < this.warehouseData.length; i++) {
      for (let j = 0; j < this.warehouseData[i].pricingForms.length; j++) {
        if ((this.warehouseData[i].pricingForms[j].controls.minPrice.value >= 0) && (this.warehouseData[i].pricingForms[j].controls.minPrice.value != "")) {
          const object = {
            "id": this.leadId,
            "attachId": this.sequenceId,
            "validEndDt": this.datePickerValueLeads,
            "maxQty": this.warehouseData[i].pricingForms[j].controls.maxPrice.value,
            "minQty": this.warehouseData[i].pricingForms[j].controls.minPrice.value,
            "price": this.warehouseData[i].pricingForms[j].controls.price.value,
            "samePriceAllWarehouse": false,
            "warehouseId": this.warehouseData[i].address.addressId,
            "paymentTerm": this.paymentTermCode,
            "note": this.notes
          }
          this.sendPricingToIndividualArrayAdd.push(object);
        }

      }
    }
    this.Userservice.sendQuoteToAllWarehouse(this.sendPricingToIndividualArrayAdd, this.leadId).then(res => {
      if (res) {
        this.getLeadObj(this.leadId);
        this.data.changeSubmitQuoteMessage("SUBMIT");
        if (this.message == "ActedLeads") {
          this.data.changeMessage("ActedLeads");
        }
        else if (this.message == "NewLeads") {
          this.data.changeMessage("NewLeads");
        }
        this._router.navigate([`/lead`]);
      }
    });
  }

  addPricingAllWarehouseAddress() {

    if (this.isEditBtnClicked && this.addPriceToAllWareHouseCheckBox) {
      this.uploadDocs();
      this.sendPricingToAllArrayEdit = [];

      for (var i = 0; i < this.editPricingAllForms.length; i++) {
        const object = {
          "id": this.leadId,
          "attachId": this.sequenceId,
          "validEndDt": this.datePickerValueLeads,
          "maxQty": this.editPricingAllForms[i].controls.maxPrice.value,
          "minQty": this.editPricingAllForms[i].controls.minPrice.value,
          "price": this.editPricingAllForms[i].controls.price.value,
          "samePriceAllWarehouse": true,
          "paymentTerm": this.paymentTermCode,
          "note": this.notes
        }
        this.sendPricingToAllArrayEdit.push(object);
      }

      this.Userservice.sendQuoteToAllWarehouse(this.sendPricingToAllArrayEdit, this.leadId).then(res => {
        if (res) {
          this.getLeadObj(this.leadId);
          this.data.changeSubmitQuoteMessage("SUBMIT");
          if (this.message == "ActedLeads") {
            this.data.changeMessage("ActedLeads");
          }
          else if (this.message == "NewLeads") {
            this.data.changeMessage("NewLeads");
          }
          this._router.navigate([`/lead`]);
        }
      });
    }
    else if (!this.isEditBtnClicked && this.addPriceToAllWareHouseCheckBox) {
      this.uploadDocs()
      this.sendPricingToAllArray = [];

      for (var i = 0; i < this.pricingForms.length; i++) {
        const object = {
          "id": this.leadId,
          "attachId": this.sequenceId,
          "validEndDt": this.datePickerValueLeads,
          "maxQty": this.pricingForms[i].controls.maxPrice.value,
          "minQty": this.pricingForms[i].controls.minPrice.value,
          "price": this.pricingForms[i].controls.price.value,
          "samePriceAllWarehouse": this.addPriceToAllWareHouseCheckBox,
          "paymentTerm": this.paymentTermCode
        }
        this.sendPricingToAllArray.push(object);

      }

      this.Userservice.sendQuoteToAllWarehouse(this.sendPricingToAllArray, this.leadId).then(res => {
        if (res) {
          this.getLeadObj(this.leadId);
          this.data.changeSubmitQuoteMessage("SUBMIT");
          if (this.message == "ActedLeads") {
            this.data.changeMessage("ActedLeads");
          }
          else if (this.message == "NewLeads") {
            this.data.changeMessage("NewLeads");
          }
          this._router.navigate([`/lead`]);
        }
      });
    }

  }

  addPriceToAllWareHouseAddress(event) {
    if (event.target.checked) {
      this.addPriceToAllWareHouseCheckBox = true;
    }
    else {
      this.addPriceToAllWareHouseCheckBox = false;
    }

  }

  filters() {
    const d = this._dialog.open(CatalogueFiltersComponent, {
      data: { selectedFiltersData: this.selectedFilters },
      disableClose: true,
      panelClass: 'catalogue-filters-popup',
      height: '90vh'
    });
    d.afterClosed().toPromise().then((data: any) => {
      if (data) {
        this.getAllSelectedFilters(data);
      }
    });
  }

  getAllSelectedFilters(filters) {
    this.selectedFilters = filters;
  }

  addWareHouseAddressBtnClicked() {
    this._router.navigate([`/user/profile/address/warehouse/add`]);
  }

  fileUpdate(files: FileList) {
    // this.item.itemForm.get('files').setValue(files);
    this.docs = files;
  }

  uploadDocs() {
    if (this.docs && this.docs.length) {

      const data = new FormData();

      const fileArr: File[] = [];

      for (let key in Object.keys(this.docs)) {
        fileArr.push(this.docs[key]);
        data.append(`files[${key}]`, this.docs[key]);
      }
      // data.append(`files`, fileArr);
      data.append('fileUploadType', 'SELLER_LEAD_RESPONSE');
      data.append('parentId', this.sequenceId);
      return this.Userservice.docUpload(data).then(res => {
        return res;
      });
    } else {
      of().toPromise();
    }

  }

  downloadDoc(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

}