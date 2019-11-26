import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { LocationsLists, CategoriesLists, UpdatedData } from '../../models/leads';
import { MatSelectionList } from '@angular/material';

@Component({
  selector: 'sub-filter',
  templateUrl: './sub-filter.component.html'
})
export class SubFilterComponent implements OnInit {

  @Input('filtersList') filtersList: Array<LocationsLists | CategoriesLists>;
  @Input('title') title: string;
  @Input('selectedFiltersList') selectedFiltersList: Array<LocationsLists | CategoriesLists>;
  @ViewChild('filtersElm', { static: false }) filtersElm: MatSelectionList;
  @Output('onUpdate') onUpdate = new EventEmitter<UpdatedData>();
  allFilterList: Array<LocationsLists | CategoriesLists>;
  filterNames: any[];

  constructor() { }

  ngOnInit() {
    this.allFilterList = this.filtersList;
  }

  isSelected(id) {
    if (this.selectedFiltersList && this.selectedFiltersList.length) {
      return this.selectedFiltersList.some(selectedFilterId => selectedFilterId === id);
    } else {
      return false;
    }
  }

  /**
   * @description function will call when specific category filters selected
   */
  filteredProductsLists() {
    const selected = this.filtersElm.selectedOptions.selected.map(opt => opt.value);
    this.onUpdate.emit({data: selected, type: this.allFilterList[0].type});
  }

  deselectFilters(id) {
    this.filtersElm.selectedOptions.selected.find(item => item.value.id == id).selected = false;
  }

  /**
   * @description function to display the search results based on entered text
   */

  searchFilter(event: string) {
    if (event) {
      this.filtersList = this.allFilterList;
      this.filtersList = this.filtersList.filter(item => {
        return item.name.toLowerCase().indexOf(event.toLowerCase()) != -1;
      });
      
    } else {
      this.filtersList = this.allFilterList;
    }
  }
}