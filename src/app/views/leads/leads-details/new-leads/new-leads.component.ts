import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SendBulkCatalogueEmailComponent } from 'src/app/shared/dialogs/send-bulk-catalogue-email/send-bulk-catalogue-email.component';
import { CatalogueFiltersComponent } from 'src/app/shared/dialogs/catalogue-filters/catalogue-filters.component';
import { DataService } from 'src/app/shared/services/data.service';

interface Warehouse {
  address: any;
  pricingForms: FormGroup[]
}

@Component({
  selector: 'app-new-leads',
  templateUrl: './new-leads.component.html'
})


export class NewLeadComponent implements OnInit {
  datePickerValue: any;
  isEditBtnClicked: boolean;
  catalogueList: any;
  catalogueListTemp: any;
  uniqueCatalogueData: any;
  pricingForm: FormGroup;
  addPriceToAllWareHouseCheckBox: boolean;
  stockResponse: any;
  addAnotherRangeCount: any[] = [];
  addPriceForRemainingQuantity: boolean;
  addPriceForRemainingIndividualQuantity: boolean[] = [];
  minValuesQty: number[] = [];
  maxValuesQty: number[] = [];
  errorMin: boolean;
  errorMax: boolean;
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
  stockstatus: boolean;
  selectedFilters: any;
  message: string;
  submitQuoteMsg: string;



  private routeSub: Subscription;
  leadId: number;
  wareHouseAdd: any;
  showLeadObjDetails: any;
  showLeadObjDetailsTemp: any;
  checkQuoteWarehouse: boolean;
  addPriceToAllWareHouseCheckBoxCheck: boolean;
  warehouseHasPricing: boolean;
  constructor(private route: ActivatedRoute, private _formBuilder: FormBuilder, private _router: Router,
    private _dialog: MatDialog,
    private snack: MatSnackBar,
    private data: DataService,
    private ref: ChangeDetectorRef,
    private _categoryService: CategoryService, private Userservice: UserService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.leadId = params['id'];
      this.data.currentMessage.subscribe(message => this.message = message);
      this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message);

      this.addPriceToAllWareHouseCheckBoxCheck = true;
      this.pricingForms = [];
      this.editPricingAllForms = [];
      this.getLeadObj(this.leadId);

    });

  }

  getLeadObj(leadId) {
    this.errorMin = false;
    this.editMinMaxIsFalse = false;
    this.AllIndividualForms = false;
    this.isEditBtnClicked = false;
    this.errorMax = false;
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
    this.addAnotherRangeCount.push('1');
    this.addAnotherRange();

    this.Userservice.getLeadObj(leadId).then(res => {
      this.showLeadObjDetails = res;
      this.showLeadObjDetailsTemp = res;
      this.getWarehouseAddress();

      if (this.showLeadObjDetails.data.warehouseList.length > 0) {
        if (this.showLeadObjDetails.data.warehouseList[0].warehousePriceList) {
          var minimumQty = this.showLeadObjDetails.data.warehouseList[0].warehousePriceList[0].minQty;
          var maximumQty = this.showLeadObjDetails.data.warehouseList[0].warehousePriceList[0].maxQty;
        }
      }

      for (let i = 0; i < this.showLeadObjDetails.data.warehouseList.length; i++) {
        if (this.showLeadObjDetails.data.warehouseList[i].warehousePriceList) {
          for (let j = 0; j < this.showLeadObjDetails.data.warehouseList[i].warehousePriceList.length; j++) {
            if ((this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].minQty != this.showLeadObjDetailsTemp.data.warehouseList[0].warehousePriceList[j].minQty) || (this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].maxQty != this.showLeadObjDetailsTemp.data.warehouseList[0].warehousePriceList[j].maxQty)) {
              this.addPriceToAllWareHouseCheckBoxCheck = false;
            }
          }
        }
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

    });

    // this.addAnotherRange();


  }

  getWarehouseAddress() {
    this.Userservice.getAddress("WAREHOUSE").then(res => {
      this.wareHouseAdd = res;
      console.log(this.wareHouseAdd.data.length);
      this.warehouseData = [];

      this.createWarehouseData(this.wareHouseAdd.data);

      if (this.showLeadObjDetails.data.warehouseList.length == this.wareHouseAdd.data.length) {
        for (let i = 0; i < this.showLeadObjDetails.data.warehouseList.length; i++) {
          if (this.showLeadObjDetails.data.warehouseList[i].warehousePriceList) {
            for (let j = 0; j < this.showLeadObjDetails.data.warehouseList[i].warehousePriceList.length; j++) {
              if ((this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].minQty != this.showLeadObjDetailsTemp.data.warehouseList[0].warehousePriceList[j].minQty) || (this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].maxQty != this.showLeadObjDetailsTemp.data.warehouseList[0].warehousePriceList[j].maxQty)) {
                this.addPriceToAllWareHouseCheckBoxCheck = false;
              }
            }
          }
        }
      }
      else {
        this.addPriceToAllWareHouseCheckBoxCheck = false;
      }

      if (!this.addPriceToAllWareHouseCheckBoxCheck) {
        this.addPriceToAllWareHouseCheckBox = false;
      } else {
        this.addPriceToAllWareHouseCheckBox = true;
      }
    });

  }

  getCatalogueItems() {
    this.Userservice.getCatalogueItems().then(res => {
      if (res.data.length > 0) {
        this.catalogueList = res.data;
        this.catalogueListTemp = this.catalogueList;
      }
      else {
        this._router.navigate([`/catalogue/add-catalogue`]);
      }
    });
  }

  createWarehouseData(warehouselist) {


    warehouselist.forEach(warehouse => {

      const forms = [];

      if (warehouse) {
        this.warehouseHasPricing = false;
        if (this.showLeadObjDetails) {
          if (this.showLeadObjDetails.data.warehouseList) {
            this.checkQuoteWarehouse = false;
            for (let i = 0; i < this.showLeadObjDetails.data.warehouseList.length; i++) {
              if (this.showLeadObjDetails.data.warehouseList[i].warehouseAddress.addressId == warehouse.addressId) {
                if (this.showLeadObjDetails.data.warehouseList[i].warehousePriceList) {
                  this.warehouseHasPricing = true;
                  for (let j = 0; j < this.showLeadObjDetails.data.warehouseList[i].warehousePriceList.length; j++) {
                    this.checkQuoteWarehouse = true;
                    forms.push(

                      this._formBuilder.group({
                        minPrice: [this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].minQty, Validators.required],
                        maxPrice: [this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].maxQty],
                        price: [this.showLeadObjDetails.data.warehouseList[i].warehousePriceList[j].price, Validators.required],
                        check: ['']
                      }, { validators: this.isMinMaxInValid })
                    );
                  }

                  if (!this.checkQuoteWarehouse) {
                    forms.push(
                      this._formBuilder.group({
                        minPrice: ['', Validators.required],
                        maxPrice: [''],
                        price: ['', Validators.required],
                        check: ['']
                      }, { validators: this.isMinMaxInValid })
                    );
                    this.checkQuoteWarehouse = false;
                  }
                }


              }

            }
            if (!this.warehouseHasPricing) {
              forms.push(
                this._formBuilder.group({
                  minPrice: ['', Validators.required],
                  maxPrice: [''],
                  price: ['', Validators.required],
                  check: ['']
                }, { validators: this.isMinMaxInValid })
              );
            }
          }
        }

      }

      // if ((!warehouse.warehousePriceList) && (this.showLeadObjDetails.data.warehouseList.length == 0)) {
      //   // if no data in price List set on default price form
      //   forms.push(
      //     this._formBuilder.group({
      //       minPrice: ['', Validators.required],
      //       maxPrice: [''],
      //       price: ['', Validators.required],
      //       check: ['']
      //     }, { validators: this.isMinMaxInValid })
      //   );
      // }
      this.warehouseData.push({
        address: warehouse,
        pricingForms: forms
      });
    });
  }

  selectUniqueCatalogue(id) {
    this.errorMin = false;
    this.editMinMaxIsFalse = false;
    this.AllIndividualForms = false;
    this.isEditBtnClicked = false;
    this.errorMax = false;
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
    this.addAnotherRangeCount.push('1');
    this.addAnotherRange();

    this.Userservice.getUniqueCatalogueItem(id).then(res => {
      if (res) {
        this.uniqueCatalogueData = res.data;
        this.warehouseData = [];
        this.createWarehouseData(this.uniqueCatalogueData.warehouseList);
        if (this.uniqueCatalogueData.catalogueItem.samePriceAllWarehouse) {
          this.addPriceToAllWareHouseCheckBox = true;
        }
        if (this.uniqueCatalogueData.warehouseList.length > 0) {
          if (this.uniqueCatalogueData.warehouseList[0].warehousePriceList.length > 0) {
            this.editPricingAllForms = [];
            this.isEditBtnClicked = true;
            for (let i = 0; i < this.uniqueCatalogueData.warehouseList[0].warehousePriceList.length; i++) {
              this.editPricingForms(i);
              this.isEditBtnClicked = true;
            }
          }
        }


        if (this.uniqueCatalogueData.catalogueItem.stockStatus == 'N') {
          this.stockstatus = false;
        }
        else if (this.uniqueCatalogueData.catalogueItem.stockStatus == 'Y') {
          this.stockstatus = true;
        }
      }
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
          console.log(form[i].controls.maxPrice.value);

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

  isEditBtnClickedFunc() {
    this.isEditBtnClicked = true;
    // console.log(this.isEditBtnClicked);
    for (let i = 0; i < this.showLeadObjDetails.data.warehouseList[0].warehousePriceList.length; i++) {
      this.editPricingForms(i);
    }
    // console.log(this.editPricingAllForms);
  }

  isEditBtnNotClickedFunc() {
    this.isEditBtnClicked = false;
    this.editPricingAllForms = [];
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
    this.datePickerValue = value.replace('/', '-');
    this.datePickerValue = this.datePickerValue.replace('/', '-');
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
        console.log(this.editPricingAllForms);
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

        console.log(this.pricingForms);
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
      // console.log(this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.value);
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


  addPricingIndividualWarehouseAddress() {
    this.sendPricingToIndividualArrayAdd = [];

    for (let i = 0; i < this.warehouseData.length; i++) {
      for (let j = 0; j < this.warehouseData[i].pricingForms.length; j++) {
        if ((this.warehouseData[i].pricingForms[j].controls.minPrice.value >= 0) && (this.warehouseData[i].pricingForms[j].controls.minPrice.value != "")) {
          // console.log(this.warehouseData[i].pricingForms[j].controls.minPrice.value);
          // console.log(this.warehouseData[i].address.addressId);
          const object = {
            "id": this.leadId,
            "maxQty": this.warehouseData[i].pricingForms[j].controls.maxPrice.value,
            "minQty": this.warehouseData[i].pricingForms[j].controls.minPrice.value,
            "price": this.warehouseData[i].pricingForms[j].controls.price.value,
            "validEndDt": this.datePickerValue,
            "warehouseId": this.warehouseData[i].address.addressId
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
    //   console.log(this.sendPricingToIndividualArrayAdd);

  }

  addPricingAllWarehouseAddress() {

    if (this.isEditBtnClicked && this.addPriceToAllWareHouseCheckBox) {
      this.sendPricingToAllArrayEdit = [];

      for (var i = 0; i < this.editPricingAllForms.length; i++) {
        for (var j = 0; j < this.wareHouseAdd.data.length; j++) {
          const object = {
            "id": this.leadId,
            "maxQty": this.editPricingAllForms[i].controls.maxPrice.value,
            "minQty": this.editPricingAllForms[i].controls.minPrice.value,
            "price": this.editPricingAllForms[i].controls.price.value,
            "validEndDt": this.datePickerValue,
            "warehouseId": this.wareHouseAdd.data[j].addressId
          }
          this.sendPricingToAllArrayEdit.push(object);
        }
      }

      //console.log(this.sendPricingToAllArrayEdit);

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
      this.sendPricingToAllArray = [];

      for (var i = 0; i < this.pricingForms.length; i++) {
        for (var j = 0; j < this.wareHouseAdd.data.length; j++) {

          const object = {
            "id": this.leadId,
            "maxQty": this.pricingForms[i].controls.maxPrice.value,
            "minQty": this.pricingForms[i].controls.minPrice.value,
            "price": this.pricingForms[i].controls.price.value,
            "validEndDt": this.datePickerValue,
            "warehouseId": this.wareHouseAdd.data[j].addressId
          }
          this.sendPricingToAllArray.push(object);
        }
      }

      //console.log(this.sendPricingToAllArray);
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


}
