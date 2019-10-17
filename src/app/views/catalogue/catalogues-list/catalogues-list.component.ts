import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { CatalogueFiltersComponent } from 'src/app/shared/dialogs/catalogue-filters/catalogue-filters.component';


interface Warehouse {
  address: any;
  pricingForms: FormGroup[]
}


@Component({
  selector: 'app-catalogues-list',
  templateUrl: './catalogues-list.component.html'
})
export class CataloguesList implements OnInit {

  isEditBtnClicked: boolean;
  catalogueList: any;
  catalogueListTemp: any;
  uniqueCatalogueData: any;
  pricingForm: FormGroup;
  addPriceToAllWareHouseCheckBox: boolean;
  stockResponse: any;
  addAnotherRangeCount: any[] = [];
  addPriceForRemainingQuantity: boolean;
  addPriceForRemainingIndividualQuantity: boolean;
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
  editMinMaxIsFalse: boolean;
  minMaxValidValue: boolean;

  constructor(private Userservice: UserService, private _formBuilder: FormBuilder, private _router: Router, private ref: ChangeDetectorRef, private _dialog: MatDialog) { }

  ngOnInit() {
    this.errorMin = false;
    this.isEditBtnClicked = false;
    this.errorMax = false;
    this.minMaxValidValue = false;
    this.addPriceForRemainingIndividualQuantity = false;
    this.addPriceToAllWareHouseCheckBox = false;
    this.addPriceForRemainingQuantity = false;
    this.addAnotherRangeCount.push('1');
    this.getCatalogueItems();
    this.addAnotherRange();

  }

  getCatalogueItems() {
    this.Userservice.getCatalogueItems().then(res => {
      if (res) {
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

  selectUniqueCatalogue(id) {
    this.errorMin = false;
    this.editMinMaxIsFalse = false;
    this.isEditBtnClicked = false;
    this.errorMax = false;
    this.minMaxValidValue = false;
    this.editMinMaxIsFalse = false;
    this.addPriceForRemainingIndividualQuantity = false;
    this.addPriceToAllWareHouseCheckBox = false;
    this.addPriceForRemainingQuantity = false;
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
        if (this.uniqueCatalogueData.warehouseList[0].warehousePriceList.length > 0) {
          this.editPricingAllForms = [];
          for (let i = 0; i < this.uniqueCatalogueData.warehouseList[0].warehousePriceList.length; i++) {
            this.editPricingForms(i);
            this.isEditBtnClicked = true;
          }
        }


      }
    });

  }

  addAnotherRange() {
    if (this.isEditBtnClicked) {
      this.editPricingAllForms.push(
        this._formBuilder.group({
          minPrice: ['', Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );

      if (this.addPriceForRemainingQuantity) {
        for (let i = 0; i < this.editPricingAllForms.length - 1; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
        }
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.disable();
      }
    }
    else if (!this.isEditBtnClicked) {
      this.pricingForms.push(
        this._formBuilder.group({
          minPrice: ['', Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );
      if (this.addPriceForRemainingQuantity) {
        for (let i = 0; i < this.editPricingAllForms.length - 1; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
        }
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.disable();
      }
    }
  }

  addAnotherRangeIndividual(form) {
    if (this.isEditBtnClicked) {
      form.push(
        this._formBuilder.group({
          minPrice: ['', Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );

      if (this.addPriceForRemainingIndividualQuantity) {
        for (let i = 0; i < form.length - 1; i++) {
          form[i].controls.maxPrice.enable();
        }
        form[form.length - 1].controls.maxPrice.disable();
        form[form.length - 1].controls.maxPrice.setValue("");
      }
    }
    else if (!this.isEditBtnClicked) {
      form.push(
        this._formBuilder.group({
          minPrice: ['', Validators.required],
          maxPrice: [''],
          price: ['', Validators.required],
          check: ['']
        }, { validators: this.isMinMaxInValid })
      );
      if (this.addPriceForRemainingIndividualQuantity) {
        for (let i = 0; i < form.length - 1; i++) {
          form[i].controls.maxPrice.enable();
        }
        form[form.length - 1].controls.maxPrice.disable();
        form[form.length - 1].controls.maxPrice.setValue("");
      }
    }
  }

  editPricingForms(i: any) {
    this.editPricingAllForms.push(
      this._formBuilder.group({
        minPrice: [this.uniqueCatalogueData.warehouseList[0].warehousePriceList[i].minQty, Validators.required],
        maxPrice: [this.uniqueCatalogueData.warehouseList[0].warehousePriceList[i].maxQty],
        price: [this.uniqueCatalogueData.warehouseList[0].warehousePriceList[i].price, Validators.required],
        check: ['']
      }, { validators: this.isMinMaxInValid })
    );
  }

  isEditBtnClickedFunc() {
    this.isEditBtnClicked = true;
    console.log(this.isEditBtnClicked);
    for (let i = 0; i < this.uniqueCatalogueData.warehouseList[0].warehousePriceList.length; i++) {
      this.editPricingForms(i);
    }
    console.log(this.editPricingAllForms);
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

  addPriceForRemainingQty(event) {
    if (event.target.checked) {
      this.addPriceForRemainingQuantity = true;
      if (this.editPricingAllForms.length > 0) {
        for (let i = 0; i < this.editPricingAllForms.length - 1; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
        }
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.disable();
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.setValue("");
        console.log(this.editPricingAllForms);
      }

      if (this.pricingForms.length > 0) {
        for (let i = 0; i < this.pricingForms.length - 1; i++) {
          this.pricingForms[i].controls.maxPrice.enable();
        }
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.disable();
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.setValue("");
        console.log(this.pricingForms);
      }
    }
    else {
      this.addPriceForRemainingQuantity = false;
      if (this.editPricingAllForms.length > 0) {
        this.editPricingAllForms[this.editPricingAllForms.length - 1].controls.maxPrice.setValue("");
        for (let i = 0; i < this.editPricingAllForms.length; i++) {
          this.editPricingAllForms[i].controls.maxPrice.enable();
        }
      }

      if (this.pricingForms.length > 0) {
        this.pricingForms[this.pricingForms.length - 1].controls.maxPrice.setValue("");
        for (let i = 0; i < this.pricingForms.length; i++) {
          this.pricingForms[i].controls.maxPrice.enable();
        }
      }
    }
  }

  addPriceForRemainingQtyIndividualWarehouse(event, priceforms, index) {
    if (event.target.checked) {
      this.addPriceForRemainingIndividualQuantity = true;
      for (let i = 0; i < priceforms.length - 1; i++) {
        this.warehouseData[index].pricingForms[i].controls.maxPrice.enable();
      }
      // this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.disable();
      this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.setValue("");
      console.log(this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.value);
    } else {
      this.addPriceForRemainingIndividualQuantity = false;
      this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.setValue("");
      for (let i = 0; i < priceforms.length; i++) {
        this.warehouseData[index].pricingForms[i].controls.maxPrice.enable();
      }
      console.log(this.warehouseData[index].pricingForms[priceforms.length - 1].controls.maxPrice.value);
    }
  }

  compareMinMaxIndvidual(currentFormIndex, Index) {

    if (currentFormIndex > 0) {
      if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.minPrice.value < this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.maxPrice.value) {
        this.editMinMaxIsFalse = true;
        this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.check.setErrors(null);
        this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.check.setErrors({ isMinMaxInValid: false });
      }
      else {
        this.editMinMaxIsFalse = false;
        this.warehouseData[Index].pricingForms[currentFormIndex - 1].controls.check.setErrors(null);
      }
    }

    else if (currentFormIndex == 0) {
      if (this.warehouseData[Index].pricingForms[currentFormIndex].controls.maxPrice.value > this.warehouseData[Index].pricingForms[currentFormIndex + 1].controls.minPrice.value) {
        this.editMinMaxIsFalse = true;
        this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors(null);
        this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors({ isMinMaxInValid: false });
      }
      else {
        this.editMinMaxIsFalse = false;
        this.warehouseData[Index].pricingForms[currentFormIndex].controls.check.setErrors(null);
      }
    }

  }


  compareMinMax(currentFormIndex) {
    if (this.pricingForms) {

      if (currentFormIndex > 0) {
        if (this.pricingForms[currentFormIndex].controls.minPrice.value < this.pricingForms[currentFormIndex - 1].controls.maxPrice.value) {
          this.pricingForms[currentFormIndex - 1].controls.maxPrice.setErrors({ isMinMaxInValid: false });
          this.editMinMaxIsFalse = true;
        }
        else {
          this.editMinMaxIsFalse = false;
          this.pricingForms[currentFormIndex - 1].controls.maxPrice.setErrors(null);
        }
      }

      else if (currentFormIndex == 0) {
        if (this.pricingForms[currentFormIndex].controls.maxPrice.value > this.pricingForms[currentFormIndex + 1].controls.minPrice.value) {
          this.editMinMaxIsFalse = true;
          this.pricingForms[currentFormIndex].controls.maxPrice.setErrors({ isMinMaxInValid: false });
        }
        else {
          this.editMinMaxIsFalse = false;
          this.pricingForms[currentFormIndex].controls.maxPrice.setErrors(null);
        }
      }

      if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value > this.editPricingAllForms[currentFormIndex].controls.maxPrice.value) {
        this.minMaxValidValue = true;
      } else {
        this.minMaxValidValue = false;
      }



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
        else {
          this.editMinMaxIsFalse = false;
          this.editPricingAllForms[currentFormIndex - 1].controls.check.setErrors(null);
        }
      }

      else if (currentFormIndex == 0) {
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

      if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value > this.editPricingAllForms[currentFormIndex].controls.maxPrice.value) {
        this.minMaxValidValue = true;
      } else {
        this.minMaxValidValue = false;
      }
    }
  }

  toggleStock(event) {
    if (event.target.checked) {
      this.Userservice.toggleStockStatus(this.uniqueCatalogueData.Cm.id, 'Y').then(res => {
        if (res) {
          this.stockResponse = res.data;
          this.Userservice.getCatalogueItems().then(res => {
            if (res) {
              this.catalogueList = res.data;
              this.catalogueListTemp = this.catalogueList;
            }
          });
        }
      });
    }
    else {
      this.Userservice.toggleStockStatus(this.uniqueCatalogueData.Cm.id, 'N').then(res => {
        if (res) {
          this.stockResponse = res.data;
          this.Userservice.getCatalogueItems().then(res => {
            if (res) {
              this.catalogueList = res.data;
              this.catalogueListTemp = this.catalogueList;
            }
          });
        }
      });
    }
  }

  addPricingIndividualWarehouseAddress() {
    this.sendPricingToIndividualArrayAdd = [];

    for (let i = 0; i < this.warehouseData.length; i++) {
      for (let j = 0; j < this.warehouseData[i].pricingForms.length; j++) {
        if ((this.warehouseData[i].pricingForms[j].controls.minPrice.value >= 0) && (this.warehouseData[i].pricingForms[j].controls.minPrice.value != "")) {
          console.log(this.warehouseData[i].pricingForms[j].controls.minPrice.value);
          console.log(this.warehouseData[i].address.addressId);
          const object = {
            "catalogueItemId": this.uniqueCatalogueData.catalogueItem.id,
            "maxQty": this.warehouseData[i].pricingForms[j].controls.maxPrice.value,
            "minQty": this.warehouseData[i].pricingForms[j].controls.minPrice.value,
            "price": this.warehouseData[i].pricingForms[j].controls.price.value,
            "samePriceAllWarehouse": false,
            "warehouseId": this.warehouseData[i].address.addressId
          }
          this.sendPricingToIndividualArrayAdd.push(object);
        }

      }
    }
    this.Userservice.sendPricingToAllWarehouse(this.sendPricingToIndividualArrayAdd);
    this.getCatalogueItems();
    // this.selectUniqueCatalogue(this.uniqueCatalogueData.catalogueItem.id);
  }

  addPricingAllWarehouseAddress() {

    if (this.isEditBtnClicked && this.addPriceToAllWareHouseCheckBox) {
      this.sendPricingToAllArrayEdit = [];

      for (var i = 0; i < this.editPricingAllForms.length; i++) {
        const object = {
          "catalogueItemId": this.uniqueCatalogueData.catalogueItem.id,
          "maxQty": this.editPricingAllForms[i].controls.maxPrice.value,
          "minQty": this.editPricingAllForms[i].controls.minPrice.value,
          "price": this.editPricingAllForms[i].controls.price.value,
          "samePriceAllWarehouse": true
        }
        this.sendPricingToAllArrayEdit.push(object);
      }

      console.log(this.sendPricingToAllArrayEdit);

      this.Userservice.sendPricingToAllWarehouse(this.sendPricingToAllArrayEdit);
    }
    else if (!this.isEditBtnClicked && this.addPriceToAllWareHouseCheckBox) {
      this.sendPricingToAllArray = [];

      for (var i = 0; i < this.pricingForms.length; i++) {
        const object = {
          "catalogueItemId": this.uniqueCatalogueData.catalogueItem.id,
          "maxQty": this.pricingForms[i].controls.maxPrice.value,
          "minQty": this.pricingForms[i].controls.minPrice.value,
          "price": this.pricingForms[i].controls.price.value,
          "samePriceAllWarehouse": this.addPriceToAllWareHouseCheckBox
        }


        this.sendPricingToAllArray.push(object);
      }

      console.log(this.sendPricingToAllArray);

      this.Userservice.sendPricingToAllWarehouse(this.sendPricingToAllArray);
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
      data: {},
      disableClose: true,
      panelClass: 'catalogue-filters-popup'
    });
  }

  addWareHouseAddressBtnClicked() {
    this._router.navigate([`/user/profile/address/warehouse/add`]);
  }

  goToAddSku() {
    this._router.navigate([`/catalogue/add-sku`]);
  }

  applySearchFilter(filterValue: string) {

    if (filterValue.trim) {

      filterValue = filterValue.toLowerCase();

      this.catalogueList = this.catalogueListTemp.filter(item => {

        return item.skuName.toLowerCase().indexOf(filterValue) != -1;

      });


    } else {
      this.catalogueList = this.catalogueList;
    }

  }

}
