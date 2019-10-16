import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-add-sku',
  templateUrl: './add-sku.component.html'
})
export class AddSkuComponent implements OnInit {
  categoryOne: any;
  categoryTwo: any;
  searchKeyTypes: any;
  brand: any;
  searchResults: any;
  idOfCatOne: number;
  brandIdTemp: number;
  idOfCatTwo: number;
  categoryId: number[] = [];
  brandId: number[] = [];
  SearchResultsIds: number[] = [];
  ischecked: boolean;
  selectedBrands: any[];

  constructor(
    private _router: Router,
    private Userservice: UserService
  ) { }

  ngOnInit() {
    this.ischecked = false;
    this.categoryId = [];
    this.searchKeyTypes = "";
    this.getCategory1();
  }


  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  selectAll(checkAll, select: NgModel, values) {
    //this.toCheck = !this.toCheck;
    if (checkAll) {
      select.update.emit(values);
    }
    else {
      select.update.emit([]);
    }
  }


  CatalogueList() {
    const data = {
      "itemList": this.SearchResultsIds
    }
    this.Userservice.addCatalogueItems(data);
    this._router.navigate(['catalogue/catalogue-list']);
  }

  getCategory1() {
    this.Userservice.getCategory().then(res => {
      if (res) {
        this.categoryOne = res;
        this.brand = null;
      }
    });
  }

  changeCategory(event) {
    const Category = event.value;
    this.categoryTwo = "";
    this.idOfCatOne = Category.id;
    this.idOfCatTwo = null;
    this.brand = null;
    this.brandId = [];
    this.brandIdTemp = null;
    if (Category.categoryList.length > 0) {
      this.categoryTwo = Category.categoryList;
    }

  }

  getIdOfCatTwo(event) {
    this.idOfCatTwo = event.value;
    this.brandId = [];
    this.brandIdTemp = null;
    this.categoryId = [];
    this.selectedBrands = [];
    this.brand = null;
    if (this.idOfCatTwo) {
      this.categoryId.push(this.idOfCatTwo);
      this.Userservice.getBrand(this.idOfCatTwo).then(res => {
        if (res) {
          this.brand = res;
        }
      });
    }
    else {
      this.categoryId.push(this.idOfCatOne);
      this.Userservice.getBrand(this.idOfCatOne).then(res => {
        if (res) {
          this.brand = res;

        }
      });
    }

  }
  getBrandOnSelect(event) {
    if (event.value) {
      this.brandIdTemp = event.value;
      //  this.brandId.push( this.brandIdTemp);
      console.log(this.brandIdTemp);
    }
    this.searchSku();
  }

  searchSku() {
    const data = {
      "brandIdList": this.brandIdTemp,
      "categoryIdList": this.categoryId
    }

    this.Userservice.getSearchResults(data).then(res => {
      if (res) {
        this.searchResults = res;
      }
    });
  }

  searchResultCheckBox(event, id) {
    // console.log(event);
    if (event.target.checked) {
      this.SearchResultsIds.push(id);
    } else {
      if (this.SearchResultsIds.includes(id)) {
        for (var i = 0; i < this.SearchResultsIds.length; i++) {
          if (this.SearchResultsIds[i] === id) {
            this.SearchResultsIds.splice(i, 1);
          }
        }
      }
    }
    if (this.SearchResultsIds.length > 0) {
      this.ischecked = true;
    }
    else {
      this.ischecked = false;
    }

    console.log(this.SearchResultsIds);
  }

  searchInAddSku(filterValue: string) {
    if (filterValue.trim) {
      this.searchKeyTypes = filterValue.toLowerCase();
    }
  }

  searchAddSkuBtn() {
    const obj = {
      "text": this.searchKeyTypes
    };
    this.Userservice.getSkuListFromSearch(obj).then(res => {
      if (res) {
        this.searchResults = res;

        this.searchKeyTypes = "";
      }
    });;

    this.searchKeyTypes = "";
  }


}


