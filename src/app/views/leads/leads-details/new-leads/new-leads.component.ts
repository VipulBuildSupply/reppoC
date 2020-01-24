import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { CatalogueFiltersComponent } from 'src/app/shared/dialogs/catalogue-filters/catalogue-filters.component';
import { DataService } from 'src/app/shared/services/data.service';
import { of } from 'rxjs';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';
import { LeadsService } from 'src/app/shared/services/leads.service';
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
  outsideQtyRangeError: boolean;
  fileExtension: string;
  isSpecsQtyInRange: true;
  isSpecsMinMaxValid: true;
  messageErr: string;

  constructor(private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _dialog: MatDialog,
    private data: DataService,
    private _leadService: LeadsService) {
  }

  ngOnInit() {
    this.startSubscriptions();
  }

  startSubscriptions() {
    this.subscriptions.push(
      this.data.currentMessage.subscribe(message => this.message = message),
      this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message),
      this.route.params.subscribe(params => {

        this.activeLeadId = parseInt(params.id);
        this.leadId = params['id'];
        this.addPriceToAllWareHouseCheckBoxCheck = true;
        this.pricingForms = [];
        this.editPricingAllForms = [];

        this._leadService.showPaymentTerms().then(res => {
          this.paymentterms = res.data;
        });

        this.getLeadObj(this.leadId);
        this.paymentForm();
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  paymentForm() {
    this.leadPaymentForm = this._formBuilder.group({
      PaymentTerm: new FormControl('', Validators.required),
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

    this._leadService.getLeadObj(leadId).then(res => {
      this.showLeadObjDetails = res;
      this.showLeadObjDetailsTemp = res;
      this.activeLeadStatus = this.activeLeadId === this.showLeadObjDetails.data.request.id ? this.showLeadObjDetails.data.request.expired : false;
      this.warehouseData = [];

      if (this.showLeadObjDetails.data.request.sellerPaymentTerm) {
        this._leadService.showPaymentTerms().then(res => {
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

      /**
       * Checked the condition if uplaoded file extension is pdf or any other
       */
      const attachedDocs = res.data.request.documents;
      attachedDocs.map(doc => {
        const [fileName, fileExt] = doc.orginalFileName.split(".");
        this.fileExtension = fileExt;
      });

      if (res.data.warehouseList && (res.data.warehouseList[0].warehousePriceList.length > 0) && (res.data.warehouseList[0].warehousePriceList[0].validEndDt)) {
        const month = res.data.warehouseList[0].warehousePriceList[0].validEndDt.substring(0, 2);
        const day = res.data.warehouseList[0].warehousePriceList[0].validEndDt.substring(3, 5);
        const year = res.data.warehouseList[0].warehousePriceList[0].validEndDt.substring(6, 10);
        const dateVal = day + "-" + month + "-" + year;
        this.datePickerValue = new FormControl(new Date(dateVal));
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
      this._leadService.getSequenceId().then(res => {
        if (res) {
          this.sequenceId = res.id;
        }
      })
      this.paymentForm();
      this.updateFileList();
    });

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

    warehouselist.forEach((warehouse) => {

      const forms: FormGroup[] = [];

      if (warehouse.specs && warehouse.specs.length) {

        if (warehouse.warehousePriceList.length === 0) {
          warehouse.specs.forEach(spec => {

            const form: FormGroup = this._formBuilder.group({
              diameter: [spec.specName],
              specMinQty: [spec.minQty, {
                validators:
                  [
                    Validators.required,
                    Validators.max(spec.minQty)
                  ]
              }],
              specMaxQty: [spec.maxQty, {
                validators:
                  [
                    Validators.required,
                    Validators.min(spec.maxQty)
                  ]
              }],
              specPrice: [spec.price, Validators.required],
              check: [''],
              specCode: [spec.specCd],
              specId: [spec.specId],
              specRelId: [spec.id]
            })

            this.subscriptions.push(
              form.get('specMinQty').valueChanges.subscribe(val => {
                form.get('specMaxQty').setValidators([Validators.required, Validators.min(val)]);
                form.get('specMaxQty').updateValueAndValidity();
              })
            )

            forms.push(form);
          });
        } else {
          warehouse.warehousePriceList.forEach(spec => {
            forms.push(
              this._formBuilder.group({
                diameter: [spec.specName],
                specMinQty: [spec.minQty, Validators.required],
                specMaxQty: [spec.maxQty],
                specPrice: [spec.price, Validators.required],
                check: [''],
                specCode: [spec.specCd],
                specId: [spec.specId],
                specRelId: [spec.id]
              })
            );
          })
        }
      }

      else {

        if (warehouse.warehousePriceList.length) {
          warehouse.warehousePriceList.forEach(pricesItem => {

            const form1 = this._formBuilder.group({
              minPrice: [pricesItem.minQty, {
                validators: [
                  Validators.required,
                  Validators.max(this.showLeadObjDetails.data.request.requestQty)
                ]
              }],
              maxPrice: [pricesItem.maxQty, {
                validators: [
                  Validators.required,
                  Validators.min(this.showLeadObjDetails.data.request.requestQty)
                ]
              }],
              price: [pricesItem.price, Validators.required],
              check: ['']
            })

            this.subscriptions.push(
              form1.get('minPrice').valueChanges.subscribe(val => {
                form1.get('maxPrice').setValidators([Validators.required, Validators.min(val)]);
                form1.get('maxPrice').updateValueAndValidity();
              })
            )

            forms.push(form1);
          });

        } else {
          // if no data in price List set on default price form
          const form = this._formBuilder.group({
            minPrice: [this.showLeadObjDetails.data.request.minQty, {
              validators: [
                Validators.required,
                Validators.max(this.showLeadObjDetails.data.request.requestQty)
              ]
            }],
            maxPrice: [this.showLeadObjDetails.data.request.maxQty, {
              validators: [
                Validators.required,
                Validators.min(this.showLeadObjDetails.data.request.requestQty)
              ]
            }],
            price: ['', Validators.required],
            check: ['']
          })

          forms.push(form);
        }
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

    var min = form.controls.minPrice.value;
    var max = form.controls.maxPrice.value;

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

    const minQty = this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value;
    const maxQty = this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value;
    const price = this.warehouseData[Index].pricingForms[currentFormIndex].controls.price.value;
    const requestedQty = this.showLeadObjDetails.data.request.requestedQty;


    if (minQty == null || minQty > maxQty || minQty == "" || minQty > requestedQty || maxQty < requestedQty) {
      this.minMaxValidValue = true;
    } else {
      this.minMaxValidValue = false;
    }

    if (price == null) {
      this.checkPriceValidate = true;

    } else if (price == "") {
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
    let [month, day, year] = this.datePickerValueLeads.split('-');
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;
    this.datePickerValueLeads = `${day}-${month}-${year}`;
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

      const requestedQty = this.showLeadObjDetails.data.request.requestQty;
      const maxPricing = this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value;
      const minPricing = this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value;

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

      /**
       * condition to check if requested quantity is in the range of min and max or not
       */
      if (minPricing > requestedQty || maxPricing < requestedQty || minPricing == null || minPricing == "") {
        this.editMinMaxIsFalse = true;
      } else {
        this.editMinMaxIsFalse = false;
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

        const requestedQty = this.showLeadObjDetails.data.request.requestQty;
        const maxPricing = this.pricingForms[currentFormIndex].controls.maxPrice.value;
        const minPricing = this.pricingForms[currentFormIndex].controls.minPrice.value;

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

        /**
         * condition to check if requested quantity is in the range of min and max or not
         */
        if (minPricing > requestedQty || maxPricing < requestedQty || minPricing == null || minPricing == "") {
          this.editMinMaxIsFalse = true;
        } else {
          this.editMinMaxIsFalse = false;
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

    if (this.showLeadObjDetails.data.warehouseList[0].specs.length > 0) {
      for (let i = 0; i < this.warehouseData.length; i++) {
        for (let j = 0; j < this.warehouseData[i].pricingForms.length; j++) {
          if ((this.warehouseData[i].pricingForms[j].controls.specMinQty.value >= 0) && (this.warehouseData[i].pricingForms[j].controls.specMinQty.value != "")) {
            const object = {
              "id": this.leadId,
              "attachId": this.sequenceId,
              "validEndDt": this.datePickerValueLeads,
              "maxQty": this.warehouseData[i].pricingForms[j].controls.specMaxQty.value,
              "minQty": this.warehouseData[i].pricingForms[j].controls.specMinQty.value,
              "price": this.warehouseData[i].pricingForms[j].controls.specPrice.value,
              "samePriceAllWarehouse": false,
              "warehouseId": this.warehouseData[i].address.addressId,
              "paymentTerm": this.paymentTermCode,
              "note": this.notes,
              "specCd": this.warehouseData[i].pricingForms[j].controls.specCode.value,
              "specId": this.warehouseData[i].pricingForms[j].controls.specId.value,
              "specName": this.warehouseData[i].pricingForms[j].controls.diameter.value,
              "specRelId": this.warehouseData[i].pricingForms[j].controls.specRelId.value
            }
            this.sendPricingToIndividualArrayAdd.push(object);
          }
        }
      }
    } else {
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
    }

    this._leadService.sendQuoteToAllWarehouse(this.sendPricingToIndividualArrayAdd, this.leadId).then(res => {
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
          "note": this.notes,
        }
        this.sendPricingToAllArrayEdit.push(object);
      }

      this._leadService.sendQuoteToAllWarehouse(this.sendPricingToAllArrayEdit, this.leadId).then(res => {
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

      debugger

      if (this.showLeadObjDetails.data.warehouseList[0].specs.length > 0) {
        for (var i = 0; i < this.warehouseData[0].pricingForms.length; i++) {
          if ((this.warehouseData[0].pricingForms[i].controls.specMinQty.value >= 0) && (this.warehouseData[0].pricingForms[i].controls.specMinQty.value != "")) {
            const object = {
              "id": this.leadId,
              "attachId": this.sequenceId,
              "validEndDt": this.datePickerValueLeads,
              "maxQty": this.warehouseData[0].pricingForms[i].controls.specMaxQty.value,
              "minQty": this.warehouseData[0].pricingForms[i].controls.specMinQty.value,
              "price": this.warehouseData[0].pricingForms[i].controls.specPrice.value,
              "samePriceAllWarehouse": this.addPriceToAllWareHouseCheckBox,
              "paymentTerm": this.paymentTermCode,
              "note": this.notes,
              "specCd": this.warehouseData[0].pricingForms[i].controls.specCode.value,
              "specId": this.warehouseData[0].pricingForms[i].controls.specId.value,
              "specName": this.warehouseData[0].pricingForms[i].controls.diameter.value,
              "specRelId": this.warehouseData[0].pricingForms[i].controls.specRelId.value
            }
            this.sendPricingToAllArray.push(object);
          }
        }
      } else {
          const object = {
            "id": this.leadId,
            "attachId": this.sequenceId,
            "validEndDt": this.datePickerValueLeads,
            "maxQty": this.warehouseData[0].pricingForms[0].controls.maxPrice.value,
            "minQty": this.warehouseData[0].pricingForms[0].controls.minPrice.value,
            "price": this.warehouseData[0].pricingForms[0].controls.price.value,
            "samePriceAllWarehouse": this.addPriceToAllWareHouseCheckBox,
            "paymentTerm": this.paymentTermCode,
            "note": this.notes,
          }
          this.sendPricingToAllArray.push(object);
      }

      this._leadService.sendQuoteToAllWarehouse(this.sendPricingToAllArray, this.leadId).then(res => {
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
      data.append('fileUploadType', 'SELLER_LEAD_RESPONSE');
      data.append('parentId', this.sequenceId);
      return this._leadService.docUpload(data).then(res => {
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


  get isAllFormValidation() {

    if (this.addPriceToAllWareHouseCheckBox) {
      const warehouseValid = this.warehouseData[0].pricingForms;
      if (warehouseValid.length > 1) {
        return warehouseValid.every(priceForm => priceForm.valid)
      } else {
        return this.warehouseData[0].pricingForms[0].valid
      }
    } else {
      return this.warehouseData.every(warehouseForm => {
        return warehouseForm.pricingForms.every(priceForm => priceForm.valid)
      });
    }
  }
}