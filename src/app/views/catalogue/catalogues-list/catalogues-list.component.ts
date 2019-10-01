import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-catalogues-list',
  templateUrl: './catalogues-list.component.html'
})
export class CataloguesList implements OnInit {

  catalogueList: any;
  uniqueCatalogueData: any;
  pricingForm: FormGroup;

  stockResponse: any;
  addAnotherRangeCount: any[] = [];
  addPriceForRemainingQuantity: boolean;
  minValuesQty: number[] = [];
  maxValuesQty: number[] = [];
  errorMin: boolean;
  errorMax: boolean;
  pricingForms: FormGroup[] = [];
  sendPricingToAllArray : any[] =[];


  constructor(private Userservice: UserService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.errorMin = false;
    this.errorMax = false;
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
      }
    });
  }

  addAnotherRange() {
    this.pricingForms.push(
      this._formBuilder.group({
        minPrice: ['',Validators.required],
        maxPrice: [''],
        price: ['', Validators.required]
      },{validators: this.isMinMaxInValid})
    );
  }

  isMinMaxInValid(form: FormGroup) {
    const min = form.controls.minPrice.value;
    const max = form.controls.maxPrice.value;

    if (min !== "" && max !== "" && (Number(min) > Number(max))){
      form.controls.minPrice.setErrors({ isMinMaxInValid:false });
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



  addPricingAllWarehouseAddress(){
    for(var i=0; i<this.pricingForms.length; i++)
    {
      console.log(this.pricingForms[i].controls.minPrice.value);
      console.log(this.pricingForms[i].controls.maxPrice.value);
      console.log(this.pricingForms[i].controls.price.value);
      const object = {
        "catalogueItemId": this.uniqueCatalogueData.catalogueItem.id,
        "maxQty": this.pricingForms[i].controls.maxPrice.value,
        "minQty": this.pricingForms[i].controls.minPrice.value,
        "price": this.pricingForms[i].controls.price.value,
        "samePriceAllWarehouse": true
      }

      this.sendPricingToAllArray.push(object);
    }

    console.log(this.sendPricingToAllArray);

    this.Userservice.sendPricingToAllWarehouse(this.sendPricingToAllArray);
  }

}
