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
  pricingForms:FormGroup[] = [];
  constructor(private Userservice: UserService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.errorMin = true;
    this.errorMax = true;
    this.addPriceForRemainingQuantity = false;
    this.addAnotherRangeCount.push('1');
    this.Userservice.getCatalogueItems().then(res => {
      if (res) {
        this.catalogueList = res.data;
        // console.log(this.catalogueList);
      }
    });
    this.formInit();
  }

  formInit() {

    this.pricingForm = this._formBuilder.group({
        min: [ '',Validators.required ],
        max: [ '', {
          validators:[Validators.required]
        } ],
        price: [  '', Validators.required ]});

    this.pricingForms.push(this.pricingForm);
}

  selectUniqueCatalogue(id) {
    this.Userservice.getUniqueCatalogueItem(id).then(res => {
      if (res) {
        this.uniqueCatalogueData = res.data;
      }
    });
  }

  addAnotherRange() {
    const newForm = this._formBuilder.group({
      min: [ '', Validators.required ],
      max: [ '', Validators.required ],
      price: [ '', Validators.required ]})

  this.pricingForms.push(this.pricingForm);
  console.log(this.pricingForms);
   this.addAnotherRangeCount.push('1');
  }

  isMinMaxValid(form: FormGroup){
    const min = form.controls.min.value;
    const max = form.controls.max.value;

    if (min > max) {
        form.controls.min.setErrors({ isMinMaxValid: false });
    }
    
    return { isMinMaxValid: false };
  }



  addPriceForRemainingQty(event) {
    if (event.target.checked) {
      this.addPriceForRemainingQuantity = true;
    }
    else {
      this.addPriceForRemainingQuantity = false;
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

  allMinQty(event, index) {

    if (this.maxValuesQty[index]) {
      var s = this.maxValuesQty[index];
      var b = event.target.value;
      if (s < b) {
        this.errorMin = false;
        this.errorMax = false;
      }
      else {
        this.minValuesQty.splice(index, 1, b);
        console.log("ALL MIN : " + this.minValuesQty);
        this.errorMin = false;
        this.errorMax = false;
      }
    }
    else if (this.maxValuesQty[(index - 1)]) {
      var s = this.maxValuesQty[(index - 1)];
      var b = event.target.value;
      if (s < b) {
        this.minValuesQty.splice(index, 1, b);
        console.log("ALL MIN : " + this.minValuesQty);
        this.errorMin = false;
      }
      else {
        this.errorMin = true;
      }
    }
    else {
      this.minValuesQty.splice(index, 1);
      this.minValuesQty.splice(index, 0, event.target.value);
      console.log("ALL MIN : " + this.minValuesQty);
      this.errorMin = false;
    }

    // this.validateMinMax();    
  }

  allMaxQty(event, index) {
    if (this.minValuesQty[index]) {
      if (this.minValuesQty[index] < event.target.value) {
        if (this.minValuesQty[(index + 1)]) {
          if (event.target.value < this.minValuesQty[(index + 1)]) {
            this.maxValuesQty.splice(index, 1, event.target.value);
            console.log("ALL MAX : " + this.maxValuesQty);
            this.errorMax = true;
          }
          else {
            this.errorMax = false;
          }
        }
        else {
          this.maxValuesQty.splice(index, 1, event.target.value);
          console.log("ALL MAX : " + this.maxValuesQty);
          this.errorMax = true;
        }

      }
      else {
        this.errorMax = false;
      }
    }
    else {
      this.maxValuesQty.splice(index, 1, event.target.value);
      console.log("ALL MAX : " + this.maxValuesQty);
      this.errorMax = true;
    }

    //  this.validateMinMax();
  }

  validateMinMax() {
    for (var i = 0; i < (this.addAnotherRangeCount.length - 1); i++) {
      var max = this.maxValuesQty[i];
      var min = this.minValuesQty[i + 1];
      if (min != undefined && max > min) {
        console.log("ERROR.. " + this.maxValuesQty[i] + " .. " + this.minValuesQty[i]);
      }
      else {
        console.log("hey");
      }
    }
  }


}
