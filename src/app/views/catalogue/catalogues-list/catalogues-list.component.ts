import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-catalogues-list',
  templateUrl: './catalogues-list.component.html'
})
export class CataloguesList implements OnInit {

  isEditBtnClicked: boolean;
  catalogueList: any;
  uniqueCatalogueData: any;
  pricingForm: FormGroup;
  addPriceToAllWareHouseCheckBox: boolean;
  stockResponse: any;
  addAnotherRangeCount: any[] = [];
  addPriceForRemainingQuantity: boolean;
  minValuesQty: number[] = [];
  maxValuesQty: number[] = [];
  errorMin: boolean;
  errorMax: boolean;
  pricingForms: FormGroup[] = [];
  editPricingAllForms: FormGroup[] = [];
  sendPricingToAllArray: any[] = [];
  sendPricingToAllArrayEdit: any[] = [];


  constructor(private Userservice: UserService, private _formBuilder: FormBuilder, private _router: Router) { }

  ngOnInit() {
    this.errorMin = false;
    this.isEditBtnClicked = false;
    this.errorMax = false;
    this.addPriceToAllWareHouseCheckBox = false;
    this.addPriceForRemainingQuantity = false;
    this.addAnotherRangeCount.push('1');
    this.Userservice.getCatalogueItems().then(res => {
      if (res) {
        this.catalogueList = res.data;
        // console.log(this.catalogueList);
      }
    });
    this.addAnotherRange();
  }



  selectUniqueCatalogue(id) {
    this.Userservice.getUniqueCatalogueItem(id).then(res => {
      if (res) {
        this.uniqueCatalogueData = res.data;
        // if(this.uniqueCatalogueData.warehouseList[0].warehousePriceList.length == 0){
        //   this._router.navigate([`/catalogue/catalogue-list/add`]);
        // }
        // else{
        //   this._router.navigate([`/catalogue/catalogue-list/details`]);
        // }
      }
    });
  }

  addAnotherRange() {
    if(this.isEditBtnClicked){
      this.editPricingAllForms.push(
        this._formBuilder.group({
          minPrice: ['', Validators.required],
          maxPrice: [''],
          price: ['', Validators.required]
        }, { validators: this.isMinMaxInValid })
      );
    }
    else if (!this.isEditBtnClicked){
      this.pricingForms.push(
        this._formBuilder.group({
          minPrice: ['', Validators.required],
          maxPrice: [''],
          price: ['', Validators.required]
        }, { validators: this.isMinMaxInValid })
      );
    }
   
  }

  editPricingForms(i) {

    this.editPricingAllForms.push(
      this._formBuilder.group({
        minPrice: [this.uniqueCatalogueData.warehouseList[0].warehousePriceList[i].minQty, Validators.required],
        maxPrice: [this.uniqueCatalogueData.warehouseList[0].warehousePriceList[i].maxQty],
        price: [this.uniqueCatalogueData.warehouseList[0].warehousePriceList[i].price, Validators.required]
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


  isMinMaxInValid(form: FormGroup) {
    const min = form.controls.minPrice.value;
    const max = form.controls.maxPrice.value;

    if (min !== "" && max !== "" && (Number(min) > Number(max))) {
      form.controls.minPrice.setErrors({ isMinMaxInValid: false });
    }


    return { isMinMaxInValid: false };
  }



  addPriceForRemainingQty(event) {
    if (event.target.checked) {
      this.addPriceForRemainingQuantity = true;
    }
    else {
      this.addPriceForRemainingQuantity = false;
    }
  }


  compareMinMax(currentFormIndex) {
    if (currentFormIndex > 0 && this.pricingForms) {
      if (this.pricingForms[currentFormIndex].controls.minPrice.value < this.pricingForms[currentFormIndex - 1].controls.maxPrice.value) {
        this.pricingForms[currentFormIndex].controls.minPrice.setErrors(null);
        this.pricingForms[currentFormIndex].controls.minPrice.setErrors({ isMinMaxInValid: false });
      }
    }
  }

  compareMinMaxEdit(currentFormIndex) {
    if (currentFormIndex > 0 && this.pricingForms) {
      if (this.editPricingAllForms[currentFormIndex].controls.minPrice.value < this.editPricingAllForms[currentFormIndex - 1].controls.maxPrice.value) {
        this.editPricingAllForms[currentFormIndex].controls.minPrice.setErrors(null);
        this.editPricingAllForms[currentFormIndex].controls.minPrice.setErrors({ isMinMaxInValid: false });
      }
    }
  }

  toggleStock(event) {
    if (event.target.checked) {
      this.Userservice.toggleStockStatus(this.uniqueCatalogueData.catalogueItem.id, 'Y').then(res => {
        if (res) {
          this.stockResponse = res.data;
          this.Userservice.getCatalogueItems().then(res => {
            if (res) {
              this.catalogueList = res.data;
              // console.log(this.catalogueList);
            }
          });
        }
      });
    }
    else {
      this.Userservice.toggleStockStatus(this.uniqueCatalogueData.catalogueItem.id, 'N').then(res => {
        if (res) {
          this.stockResponse = res.data;
          this.Userservice.getCatalogueItems().then(res => {
            if (res) {
              this.catalogueList = res.data;
              // console.log(this.catalogueList);
            }
          });
        }
      });
    }
  }



  addPricingAllWarehouseAddress() {
    if (this.isEditBtnClicked) {
      for (var i = 0; i < this.editPricingAllForms.length; i++) {
        console.log(this.editPricingAllForms[i].controls.minPrice.value);
        console.log(this.editPricingAllForms[i].controls.maxPrice.value);
        console.log(this.editPricingAllForms[i].controls.price.value);
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
    else if (!this.isEditBtnClicked) {
      for (var i = 0; i < this.pricingForms.length; i++) {
        console.log(this.pricingForms[i].controls.minPrice.value);
        console.log(this.pricingForms[i].controls.maxPrice.value);
        console.log(this.pricingForms[i].controls.price.value);
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




}
