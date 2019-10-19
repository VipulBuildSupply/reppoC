import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
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
  categoryNames: any = [];
  @ViewChild('filtersElm', { static: false }) filtersElm: MatSelectionList;
  catIds: any;

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

      if (this.data.selectedFiltersData && this.data.selectedFiltersData.length) {
        this.categoryNames = this.filtersList.filter(item => this.data.selectedFiltersData.indexOf(item.id) != -1);
      }
    });
  }

  isSelected(id): boolean {
    if (this.data.selectedFiltersData && this.data.selectedFiltersData.length) {
      return this.data.selectedFiltersData.some(selectedFilterId => selectedFilterId == id);
    } else {
      return false
    }
  }

  /**
   * @description function to close popup window
   */
  closeDialog(selected): void {
    this.dialogRef.close(selected);
  }

  /**
   * @description function to display the search results based on entered text
   */

  searchFilter(event: string) {
    if (event) {
      this.filtersList = this.allFilterList;
      this.filtersList = this.filtersList.filter(item => {
        return item.categoryName.toLowerCase().indexOf(event.toLowerCase()) != -1;
      });
    } else {
      this.filtersList = this.allFilterList;
    }
  }

  /**
   * @description function will call when specific category filters selected
   */
  filteredProductsLists(selectedOption) {
    if (selectedOption.selected) {
      this.filteredLists.categoryIdList.push(selectedOption.value.id);
      this.categoryNames = this.filtersElm.selectedOptions.selected.map(filter => filter.value);
    } else {
      const index = this.filteredLists.categoryIdList.findIndex(item => item.value == selectedOption.value.id)
      this.filteredLists.categoryIdList.splice(index, 1);

      const index1 = this.categoryNames.findIndex(opt => opt.id == selectedOption.value.id);
      this.categoryNames.splice(index1, 1);
    }
  }

  /**
   * function will execute when click on apply button
   */
  applyFilters() {
    const selected = this.filtersElm.selectedOptions.selected.map(filter => filter.value.id);
    this.displayUpdatedProducts(selected);
    this.closeDialog(selected);
  }

  /**
   * @description function to remove specific filters from selecetd filters list
   */
  cancelFilters(option) {
    this.filtersElm.options.find(op => op.value.id == option.id).selected = false;
    this.categoryNames = this.filtersElm.selectedOptions.selected.map(filter => filter.value);

    const index = this.filteredLists.categoryIdList.findIndex(item => item == option.id);
    this.filteredLists.categoryIdList.splice(index, 1);
  }

  /**
   * @description function to get the skus list based on selected category filters
   */
  displayUpdatedProducts(filterObj) {
    const data = {
      "categoryIdList": filterObj
    };
    return this._categoryService.getFilteredSkus(data).then((res: any) => {
      this._categoryService.updateSkusList$.next(res.data);
      return res.data;
    });
  }
}