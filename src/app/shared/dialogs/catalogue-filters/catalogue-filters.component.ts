import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';
import { CategoryService } from '../../services/category.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'catalogue-filters',
  templateUrl: './catalogue-filters.component.html'
})
export class CatalogueFiltersComponent implements OnInit {

  profileVerifyForm: FormGroup;
  email: any;
  filtersList: any;
  allFilterList: any;
  categoryId: any;
  filteredLists: any = {
    "categoryIdList": []
  };
  skusList: any;

  constructor(private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CatalogueFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private notify: NotificationService,
    private _categoryService: CategoryService,
    private _token: TokenService) { }

  ngOnInit() {
    this.getAllFilters();
  }

  /**
   * @description Get all filters list
   */
  getAllFilters() {
    this._categoryService.getCatalogueFilters().then(res => {
      this.filtersList = res.data.map(filter => filter);
      this.allFilterList = this.filtersList;
    });
  }

  /**
   * @description function to close popup window
   */
  closeDialog(): void {
    this.dialogRef.close(null);
  }

  /**
   * @description function to display the search results based on entered text
   */

  searchFilter(event: string) {
    /*if (event) {
      this.filtersList = this.allFilterList;
      this.filtersList = this.filtersList.filter(item => {
        return item.toLowerCase().indexOf(event.toLowerCase()) != -1;
      });
    } else {
      this.filtersList = this.allFilterList;
    }*/
  }

  /**
   * @description function will call when specific category filters selected
   */

  filteredProductsLists(option, id) {    
    if (option.checked === true) {
        this.filteredLists.categoryIdList.push(id);
    }else {
        const index = this.filteredLists.categoryIdList.findIndex(item => item.value == id)
        this.filteredLists.categoryIdList.splice(index, 1);
    }
    this.displayUpdatedProducts(this.filteredLists);
  }

  /**
   * @description function to get the skus list based on selected category filters
   */
  displayUpdatedProducts(filterObj) {
    return this._categoryService.getFilteredSkus(filterObj).then((res: any) => {
      this._categoryService.updateSkusList$.next(res.data);
      return this.skusList;
    });
  }
}