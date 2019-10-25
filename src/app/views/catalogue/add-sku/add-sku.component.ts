import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { NgModel } from '@angular/forms';
import { SendSkuEmailComponent } from 'src/app/shared/dialogs/send-sku-email/send-sku-email.component';
import { MatDialog } from '@angular/material';

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
  selectAllBox: boolean;
  constructor(
    private _router: Router,
    private Userservice: UserService,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    this.ischecked = false;
    this.categoryId = [];
    this.searchKeyTypes = "";
    this.selectAllBox = false;
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
    this.Userservice.addCatalogueItems(data).then(res => {
      if (res.data.success == true) {
        this._router.navigate(['catalogue/catalogue-list']);
      }
    });
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
    this.selectAllBox = false;
    this.idOfCatOne = Category.id;
    this.idOfCatTwo = null;
    this.brand = null;
    this.brandId = [];
    this.selectedBrands = [];
    this.categoryId = [];
    this.SearchResultsIds = [];
    this.brandIdTemp = null;
    if (Category.categoryList.length > 0) {
      this.categoryTwo = Category.categoryList;
    }
    this.categoryId.push(this.idOfCatOne);

    const data = {
      "brandIdList": [],
      "categoryIdList": [this.idOfCatOne]
    }
    this.Userservice.getBrand(this.idOfCatOne).then(res => {
      if (res) {
        this.brand = res;

      }
    });

    this.Userservice.getSearchResults(data).then(res => {
      if (res) {
        this.searchResults = res;
      }
    });

  }

  getIdOfCatTwo(event) {
    this.idOfCatTwo = event.value;
    this.selectAllBox = false;
    this.brandId = [];
    this.brandIdTemp = null;
    this.categoryId = [];
    this.SearchResultsIds = [];
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
    this.searchSku();
  }
  getBrandOnSelect(event) {
    this.selectAllBox = false;
    this.SearchResultsIds = [];

    if (event.value) {
      this.brandIdTemp = event.value;
      //    console.log(this.brandIdTemp);
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


  selectAllCheckbox(event, items) {
    if (event.target.checked) {
      this.selectAllBox = true;
      for (let i = 0; i < items.length; i++) {
        this.SearchResultsIds.push(items[i].id);
      }

    }
    else {
      this.selectAllBox = false;
      this.SearchResultsIds = [];
    }

    if (this.SearchResultsIds.length > 0) {
      this.ischecked = true;
    }
    else {
      this.ischecked = false;
    }
  }

  selectAllCheckboxRemove(event) {
    if (!event.target.checked) {
      this.ischecked = false;
      this.selectAllBox = false;
      this.SearchResultsIds = [];
    }
    else {
      this.selectAllBox = false;
      this.SearchResultsIds = [];
    }
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


  openDialog(): void {
    const dialogRef = this._dialog.open(SendSkuEmailComponent, {
      data: { category: this.categoryId[0], brands: this.brandIdTemp },
      panelClass: 'sku-email-popup'
    });

  }
}


