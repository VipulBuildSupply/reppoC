import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoryService } from '../../services/category.service';
import { Filters, CategoriesLists, LocationsLists, UpdatedData } from '../../models/leads';
import { SubFilterComponent } from '../../components/sub-filter/sub-filter.component';
import { LeadFilterSku } from '../../models/lead-filter-sku';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lead-filters',
  templateUrl: './lead-filters.component.html'
})
export class LeadFiltersComponent implements OnInit {

  @ViewChild('locationFilter', { static: false }) locationFilter: SubFilterComponent;
  @ViewChild('categoryFilter', { static: false }) categoryFilter: SubFilterComponent;
  selectedFilters: Array<LocationsLists | CategoriesLists> = [];
  filtersList: Filters;
  filteredSkus: LeadFilterSku;
  selectedLocCode: string[] = [];
  selectedCatId: number[] = [];
  // subscriptions: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<LeadFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _categoryService: CategoryService) { }

  ngOnInit() {
    this.getAllFilters();
  }

  /**
   * @description Get all filters list
   */
  getAllFilters() {
    this._categoryService.getLeadsFilters().then(res => {
      res.data.locations.forEach(elm => {
        elm.type = 'locations';
      });

      res.data.categories.forEach(elm => {
        elm.type = 'categories';
      });

      this.filtersList = res.data;

      // this.data.selectedFiltersData = this.data.filterCount == 0 ? [] : this.data.selectedFiltersData;

      if (this.data.selectedFiltersData && this.data.selectedFiltersData.length) { 
        const locationsList = this.filtersList.locations.filter(item => this.data.selectedFiltersData.indexOf(item.id) != -1);
        const categoriesList = this.filtersList.categories.filter(item => this.data.selectedFiltersData.indexOf(item.id) != -1);
        this.selectedFilters = [...locationsList, ...categoriesList];
      }
    });
  }

  /**
   * @description function to close popup window
   */
  closeDialog(selected?): void {
    this.dialogRef.close(selected);
  }

  /**
   * function will execute when click on apply button
   */
  applyFilters() {
    
    this.selectedFilters.map(item => {
      if(item.type == 'locations' && item.code){
          this.selectedLocCode.push(item.code);
      }

      if(item.type == 'categories' && item.id){
        this.selectedCatId.push(item.id);
      }
    });

    // this._categoryService.countLeadFilters$.next(this.selectedFilters.length);

    if(this.selectedLocCode && this.selectedCatId){
      this.displayUpdatedSkus(this.selectedLocCode, this.selectedCatId);
    }

    const filtersId = this.selectedFilters.map(item => item.id);
    const dataAfterClosed = [{ tab: this.data.activeLeadtab}, { filtersId: filtersId}];
    this.closeDialog(dataAfterClosed);
  }

  /**
   * @description function will call when specific category filters selected
   */
  selectedFiltersList(selectedList: UpdatedData) {
    const otherList = this.selectedFilters.filter(itm => itm.type !== selectedList.type);
    this.selectedFilters = [...selectedList.data, ...otherList];
  }

  /**
   * @description function to remove specific filters from selecetd filters list
   */
  cancelFilters(selectedOption: LocationsLists | CategoriesLists) {
    this.selectedFilters = this.selectedFilters.filter(op => op.id != selectedOption.id);
    if (selectedOption.type == 'locations') {
      this.locationFilter.deselectFilters(selectedOption.id);
    } else {
      this.categoryFilter.deselectFilters(selectedOption.id)
    }
  }

  /**
   * @description function to get the skus list based on selected category filters
   */
  displayUpdatedSkus(selectedLocCode, selectedCatId) {

    if(this.data.activeLeadtab == 'ActedLeads'){
      this.filteredSkus = {
        "statusList": ['ADD', 'SUBMIT']
      }
      if(selectedCatId && selectedCatId.length){
        this.filteredSkus.categoryIdList = selectedCatId;
      }
      if(selectedLocCode && selectedLocCode.length){
        this.filteredSkus.locationCodeList = selectedLocCode;
      }

    }else{
      this.filteredSkus = {};

      if(selectedCatId && selectedCatId.length){
        this.filteredSkus.categoryIdList = selectedCatId;
      }
      if(selectedLocCode && selectedLocCode.length){
        this.filteredSkus.locationCodeList = selectedLocCode;
      }
    }

    return this._categoryService.getUpdatedSkusList(this.filteredSkus).then((res: any) => {
      this._categoryService.updateLeadsSkusList$.next(res.data);
      return res.data;
    });
  }
}