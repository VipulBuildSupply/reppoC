import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LocationsLists, Filters } from '../../models/leads';
import { MatSelectionList } from '@angular/material';

@Component({
  selector: 'sub-filter',
  templateUrl: './sub-filter.component.html'
})
export class SubFilterComponent implements OnInit {
  
  @Input('filtersList') filtersList: Filters;
  @Input('title') title: string;
  @ViewChild('filtersElm', { static: false }) filtersElm: MatSelectionList;

  filterNames: any[];

  constructor(){}
  
  ngOnInit(){
    console.log(this.filtersList);
  }

  isSelected(id) {
    
    
    // if (this.data.selectedFiltersData && this.data.selectedFiltersData.length) {
    //   return this.data.selectedFiltersData.some(selectedFilterId => selectedFilterId === id);
    // } else {
    //   return false;
    // }
  }

  /**
   * @description function will call when specific category filters selected
   */
  filteredProductsLists(selectedOption) {
    
    if (selectedOption.selected) {  
      this.filterNames = this.filtersElm._value;
      // console.log(selectedOption.selected);
      
      // this.categoryNames = this.filtersCatElm.selectedOptions.selected.map(filter => filter.value);
    } else {
      // const index1 = this.locNames.findIndex(opt => opt.id == selectedOption.value.id);
      // this.locNames.splice(index1, 1);

      // const index2 = this.categoryNames.findIndex(opt => opt.id == selectedOption.value.id);
      // this.categoryNames.splice(index2, 1);
    }
  }


}
