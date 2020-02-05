
import { OnInit, Component, ViewChild } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { LeadFiltersComponent } from 'src/app/shared/dialogs/lead-filters/lead-filters.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { LocationsLists, CategoriesLists } from 'src/app/shared/models/leads';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { LeadSidebarComponent } from './lead-sidebar/lead-sidebar.component';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html'
})
export class LeadDetailsComponent implements OnInit {
  new_tab: string;
  acted_tab: string;
  message: string;
  search: String;
  selectedFilters: Array<LocationsLists | CategoriesLists>;
  count: number;
  submitQuoteMsg: string;
  tabName: string;
  currentmessage: Subscription;
  submitQuote: Subscription;
  @ViewChild('leadSideBar', { static: false }) leadSideBar: LeadSidebarComponent;
  hasLeads: boolean;
  subscriptions: Subscription[] = [];

  constructor(private data: DataService,
    private _dialog: MatDialog,
    private _leadService: LeadsService) { }

  ngDoCheck() {
    this.data.currentMessage.subscribe(message => this.message = message);
    if (this.message == "ActedLeads") {
      this.getActiveFiltersCount();
      this.toggleActedLeads();
    }
    else if (this.message == "NewLeads") {
      this.getActiveFiltersCount();
      this.toggleNewLeads();
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

    // this.getNewLeads();
    this.startSubscriptions();
  }

  // getNewLeads(){
  //   this._leadService.getNewLeads().then(res => {
  //     if (res) {
  //       if (res.data.length > 0) {
  //         this.toggleNewLeads();
  //       }
  //       else {
  //         this.toggleActedLeads();
  //       }
  //     }
  //     else {
  //       this.toggleActedLeads();
  //     }
  //   });
  // }

  startSubscriptions(){
    this.subscriptions.push(
      this._leadService.hasNewLeads$.subscribe(value => {
        this.hasLeads = value;
        // debugger
      })
    );
  }

  toggleNewLeads() {
    this.acted_tab = "inactive-tab";
    this.new_tab = "active-tab";
    this.data.changeMessage("NewLeads");
  }

  toggleActedLeads() {
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

  /**
   * Get all active filters Numbers
   */
  getActiveFiltersCount() {
    if (this.tabName && this.tabName.length) {
      this.count = this.tabName != this.message ? 0 : this.count;
      this.selectedFilters = this.tabName != this.message ? [] : this.selectedFilters;
    }
  }

  ngOnDestroy() {
    if (this.currentmessage) {
      this.currentmessage.unsubscribe();
    }
    if (this.submitQuote) {
      this.submitQuote.unsubscribe();
    }

    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
}