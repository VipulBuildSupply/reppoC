
import { OnInit, Component, ViewChild } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { LeadFiltersComponent } from 'src/app/shared/dialogs/lead-filters/lead-filters.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { LocationsLists, CategoriesLists } from 'src/app/shared/models/leads';
import { LeadSidebarComponent } from '../../lead-sidebar/lead-sidebar.component';

@Component({
  selector: 'app-lead-layout',
  templateUrl: './lead-layout.component.html'
})
export class LeadLayoutComponent implements OnInit {
  new_tab = "inactive";
  acted_tab = "inactive";
  message: string;
  search: String;
  selectedFilters: Array<LocationsLists | CategoriesLists>;
  count: number;
  submitQuoteMsg: string;
  tabName: string;

  currentmessage: Subscription;
  submitQuote: Subscription;

  @ViewChild('leadSideBar', { static: false }) leadSideBar: LeadSidebarComponent;

  constructor(private data: DataService,
    private _dialog: MatDialog,
    private _userService: UserService,
    private _categoryService: CategoryService
  ) { }

  ngDoCheck() {
    this.data.currentMessage.subscribe(message => this.message = message);
    if (this.message == "ActedLeads") {
      this.getActiveFiltersCount();
      this.toggleleadsacted();
    }
    else if (this.message == "NewLeads") {
      this.getActiveFiltersCount();
      this.toggleleadsnew();
    }
  }
  ngOnInit() {
    this.new_tab = "active-tab";
    this.acted_tab = "inactive-tab";
    this.currentmessage = this.data.currentMessage.subscribe(message => this.message = message);

    this.submitQuote = this.data.submitQuoteMsg.subscribe(message => {
      this.submitQuoteMsg = message;
      if (this.submitQuoteMsg == 'SUBMIT') {
        this.leadSideBar.loadComponent();
      }

    });

    this._userService.getNewLeads().then(res => {
      if (res) {
        if (res.data.length > 0) {
          this.toggleleadsnew();
        }
        else {
          this.toggleleadsacted();
        }

      }
      else {
        this.toggleleadsacted();
      }

    });
  }

  ngOnDestroy() {
    if (this.currentmessage) {
      this.currentmessage.unsubscribe();
    }
    if (this.submitQuote) {
      this.submitQuote.unsubscribe();
    }
  }

  toggleleadsnew() {
    this.acted_tab = "inactive-tab";
    this.new_tab = "active-tab";
    this.data.changeMessage("NewLeads");
  }
  toggleleadsacted() {
    this.acted_tab = "active-tab";
    this.new_tab = "inactive-tab";
    this.data.changeMessage("ActedLeads");
  }

  filters() {
    const d = this._dialog.open(LeadFiltersComponent, {
      data: { selectedFiltersData: this.selectedFilters, activeLeadtab: this.message, filterCount: this.count },
      disableClose: true,
      panelClass: 'catalogue-filters-popup',
      height: '90vh'
    });
    d.afterClosed().toPromise().then((data: any) => {
      if (data) {
        this.getAllSelectedFilters(data[1].filtersId);
        this.tabName = data[0].tab;
      }
    });
  }

  getAllSelectedFilters(filters) {
    this.selectedFilters = filters;
    this.count = this.selectedFilters.length;
  }

  applySearchFilter(filterValue: String) {
    if (filterValue.trim) {
      filterValue = filterValue.toLowerCase();
      this.search = filterValue;
      this.leadSideBar.searchFilter(filterValue);
    }
  }


  getActiveFiltersCount() {
    if (this.tabName && this.tabName.length) {
      this.count = this.tabName != this.message ? 0 : this.count;
      this.selectedFilters = this.tabName != this.message ? [] : this.selectedFilters;
    }
  }
}