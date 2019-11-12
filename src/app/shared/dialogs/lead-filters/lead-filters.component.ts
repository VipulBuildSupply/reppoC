import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';
import { TokenService } from '../../services/token.service';
import { LeadsService } from '../../services/leads.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'lead-filters',
  templateUrl: './lead-filters.component.html'
})
export class LeadFiltersComponent implements OnInit {

  filtersList: any;
  allFilterList: any;
  categoryId: any;
  filteredLists: any = {
    "categoryIdList": []
  };
  categoryNames: any = [];
  @ViewChild('filtersElm', { static: false }) filtersElm: MatSelectionList;
  catIds: any;

  constructor(public dialogRef: MatDialogRef<LeadFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _leadsService: LeadsService,
    private _categoryService: CategoryService) { }

    ngOnInit() {
      this.getAllFilters();
    }
  
    /**
     * @description Get all filters list
     */
    getAllFilters() {
      this._categoryService.getLeadsFilters().then(res => {
        this.filtersList = res.data;
        // this.allFilterList = this.filtersList;

        console.log(this.filtersList);
  
        if (this.data.selectedFiltersData && this.data.selectedFiltersData.length) {
          this.categoryNames = this.filtersList.filter(item => this.data.selectedFiltersData.indexOf(item.id) != -1);
        }
      });
    }


    isSelected(id): boolean {
      if (this.data.selectedFiltersData && this.data.selectedFiltersData.length) {
        return this.data.selectedFiltersData.some(selectedFilterId => selectedFilterId === id);
      } else {
        return false;
      }
    }

    /**
     * @description function to close popup window
     */
    closeDialog(selected?): void {
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
      
      console.log(this.filtersElm);
      
      if (selectedOption.selected) {
        this.categoryNames = this.filtersElm.selectedOptions.selected.map(filter => filter.value);
      } else {
        const index1 = this.categoryNames.findIndex(opt => opt.id == selectedOption.value.id);
        this.categoryNames.splice(index1, 1);
      }
    }

    /**
     * function will execute when click on apply button
     */
    applyFilters() {
      const selected = this.filtersElm.selectedOptions.selected.map(filter => filter.value.id);
      this._categoryService.selectedFiltersCount$.next(selected.length);
      this.displayUpdatedProducts(selected);
      this.closeDialog(selected);
    }

    /**
     * @description function to remove specific filters from selecetd filters list
     */
    cancelFilters(option) {
      this.filtersElm.options.find(op => op.value.id === option.id).selected = false;
      this.categoryNames = this.filtersElm.selectedOptions.selected.map(filter => filter.value);
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
