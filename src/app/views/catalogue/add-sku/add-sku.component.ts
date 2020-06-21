import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { NgModel } from '@angular/forms';
import { SendSkuEmailComponent } from 'src/app/shared/dialogs/send-sku-email/send-sku-email.component';
import { MatDialog, MatSelectChange } from '@angular/material';
import { SelectionChange } from '@angular/cdk/collections';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-add-sku',
  templateUrl: './add-sku.component.html'
})
export class AddSkuComponent implements OnInit {
  allCategories: Category;
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
  selectedCats: Category[] = [];

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;

  constructor(
    private _router: Router,
    private userService: UserService,
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
    this.userService.addCatalogueItems(data).then(res => {
      if (res.data.success == true) {
        this._router.navigate(['catalogue/catalogue-list']);
      }
    });
  }

  getCategory1() {
    this.userService.getCategory().then(data => {
      if (data) {
        this.allCategories = data;
        this.selectedCats[0] = data;
        this.brand = null;
      }
    });
  }

  changeCategory(event: MatSelectChange, catLevel: number) {

    const Category = event.value;
    this.selectedCats[catLevel] = event.value.categoryList;
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


    this.userService.getBrand(this.idOfCatOne).then(res => {
      if (res) {
        this.brand = res;

      }
    });

    if (!event.value.categoryList.length) {
      this.getItems(event.value.id);
    } else {
      this.searchResults = { data: { skuList: [] } };
    }

  }

  getItems(catId: number) {
    const data = {
      brandIdList: [],
      categoryIdList: [catId],
      text: this.searchInput.nativeElement.value,
      primarySku: false
    };
    this.userService.getSearchResults(data).then(res => {
      if (res) {
        this.searchResults = res;
      }
    }, err => {
      this.searchResults = { data: { skuList: [] } };
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
      this.userService.getBrand(this.idOfCatTwo).then(res => {
        if (res) {
          this.brand = res;
        }
      });
    }
    else {
      this.categoryId.push(this.idOfCatOne);
      this.userService.getBrand(this.idOfCatOne).then(res => {
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
    }
    this.searchSku();
  }

  searchSku() {
    const data = {
      "brandIdList": this.brandIdTemp,
      "categoryIdList": this.categoryId,
      "primarySku": false
    }

    this.userService.getSearchResults(data).then(res => {
      if (res) {
        this.searchResults = res;
      }
    });
  }


  selectAllCheckbox(event, items) {
    if (event.target.checked) {
      this.SearchResultsIds = [];
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
  }

  searchInAddSku(filterValue: string) {
    if (filterValue.trim) {
      this.searchKeyTypes = filterValue.toLowerCase();
    }
  }

  searchAddSkuBtn() {
    // todo: WE need to add selected category and brands Ids here as well

    const data = {
      "brandIdList": this.brandIdTemp,
      "categoryIdList": this.categoryId,
      "primarySku": false,
      text: this.searchKeyTypes,
    }
    this.userService.getSearchResults(data).then(res => {
      if (res) {
        this.searchResults = res;

        this.searchKeyTypes = "";
      }
    });

    this.searchKeyTypes = "";
  }


  openDialog(): void {
    const dialogRef = this._dialog.open(SendSkuEmailComponent, {
      data: { category: this.categoryId[0], brands: this.brandIdTemp, text: this.searchInput.nativeElement.value },
      panelClass: 'sku-email-popup'
    });

  }
}


