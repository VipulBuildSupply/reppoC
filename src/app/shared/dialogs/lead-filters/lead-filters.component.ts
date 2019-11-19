import { Component, OnInit, Inject, ViewChild, ViewChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectionList } from '@angular/material';
import { LeadsService } from '../../services/leads.service';
import { CategoryService } from '../../services/category.service';
import { Filters, LocationsLists } from '../../models/leads';

@Component({
  selector: 'lead-filters',
  templateUrl: './lead-filters.component.html'
})
export class LeadFiltersComponent implements OnInit {
  constructor() {

  }

  ngOnInit() {

  }
}



