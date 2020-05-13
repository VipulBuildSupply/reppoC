import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../../shared/services/category.service';
import { LeadsService } from '../../../../shared/services/leads.service';
import { CustomDatePipe } from '../../../../shared/pipes/custom-date.pipe';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lead-sidebar',
  templateUrl: './lead-sidebar.component.html',
  providers: [ CustomDatePipe ]
})

export class LeadSidebarComponent implements OnInit {

  new_leads: any;
  new_leadsTemp: any;
  bookmarkClicked: boolean[] = [];
  message: string;
  search: string;
  submitQuoteMsg: string;
  @Input() childMessage: string;
  activeLeads: boolean[];
  subscriptions: Subscription[] = [];
  currentActiveTab: string;

  constructor(private _dataService: DataService,
    private _categoryService: CategoryService,
    private _leadService: LeadsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    this.bookmarkClicked = [];
    this.activeLeads = [];
    this.startSubscriptions();

    /*if (this.submitQuoteMsg === "SUBMIT") {
      this._leadService.getNewLeads().then(res => {
        this.new_leads = res.data;
        this.new_leadsTemp = res.data;
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');
      });
    }*/

    // this.getNewLeads();
  }

  searchFilter(filterValue?) {
    if (filterValue != '' || filterValue != null) {
      if (this.new_leads) {
        this.new_leads = this.new_leadsTemp.filter(item => {
          return item.skuName.toLowerCase().indexOf(filterValue) != -1;
        });
      }

    } else {
      this.new_leads = this.new_leadsTemp;
    }
  }

  startSubscriptions() {
    this.subscriptions.push(
      this._categoryService.updateLeadsSkusList$.subscribe(data => {
        if (data) {
          this.new_leads = data;
          this.new_leadsTemp = data;
        }
      }),
      // this.data.currentMessage.subscribe(message => this.message = message),
      // this.data.activeTab$.subscribe(message => this.message = message),
      this._dataService.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message),

      /**
       * Call if selected path is new lead or acted lead
       */
      this._activatedRoute.url.subscribe(url => {
        if (url[ 0 ].path === "new-lead") {
          this.getNewLeadsTab();
          this.currentActiveTab = "NewLeads";
        } else {
          this.getActedLeadsTab();
          this.currentActiveTab = "ActedLeads";
        }
      })
    )
  }

  /**
   * Get all New Leads Lists
   */
  getNewLeadsTab() {
    if (this.submitQuoteMsg === "SUBMIT") {
      this._leadService.getNewLeads().then(res => {
        if (res) {
          if (res.data.length > 0) {
            this.new_leads = res.data;
            this.new_leadsTemp = res.data;
          }
          else {
            // this._leadService.hasNewLeads$.next(false);
            // this._dataService.changeMessage("ActedLeads");
          }
        }
        else {
          // this._dataService.changeMessage("ActedLeads");
        }

      });

      this._dataService.changeSubmitQuoteMessage('NOTSUBMITTED');

    } else {
      this._leadService.getNewLeads().then(res => {
        if (res) {
          if (res.data.length > 0) {
            this.new_leads = res.data;
            this.new_leadsTemp = res.data;
            this.bookmarkClicked = [];
          }
          else {
            // this._dataService.changeMessage("ActedLeads");
            // this._leadService.hasNewLeads$.next(false);
          }
        }
        else {
          // this._dataService.changeMessage("ActedLeads");
        }
      });
    }
  }


  /**
   * Get all Acted Leads Lists
   */
  getActedLeadsTab() {
    if (this.submitQuoteMsg === "SUBMIT") {
      this._leadService.getActedLeads().then(res => {
        if (res) {
          if (res.data.length > 0) {
            this.new_leads = res.data;
            this.new_leadsTemp = res.data;
          }
          else {
            this._dataService.changeMessage("NewLeads");
          }
        }
        else {
          this._dataService.changeMessage("NewLeads");
        }
      });
      this._dataService.changeSubmitQuoteMessage('NOTSUBMITTED');

    } else {

      this._leadService.getActedLeads().then(res => {
        if (res) {
          if (res.data.length > 0) {
            this.new_leads = res.data;
            this.new_leadsTemp = res.data;
            this.bookmarkClicked = [];
            for (let i = 0; i < this.new_leads.length; i++) {
              if (this.new_leads[ i ].statusCd == "quote.request.sts.seller.add") {
                this.bookmarkClicked[ i ] = true;
              }
            }
          }
          else {
            this._dataService.changeMessage("NewLeads");
          }
        }
        else {
          this._dataService.changeMessage("NewLeads");
        }
      });
    }
  }

  /*getNewLeads() {
    if (this.submitQuoteMsg === "SUBMIT") {
      if (this.message === "NewLeads") {
        this._leadService.getNewLeads().then(res => {
          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
        });
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');

      }
      if (this.message == "ActedLeads") {
        this._leadService.getActedLeads().then(res => {
          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
        });
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');
      }
    }
    if (this.message != undefined) {
      if (this.message === "NewLeads") {
        this._leadService.getNewLeads().then(res => {
          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
          this.bookmarkClicked = [];
        });
      }
      else if (this.message === "ActedLeads") {
        this._leadService.getActedLeads().then(res => {
          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
          this.bookmarkClicked = [];
          for (let i = 0; i < this.new_leads.length; i++) {
            if (this.new_leads[i].statusCd == "quote.request.sts.seller.add") {
              this.bookmarkClicked[i] = true;
            }
          }
        });
        this.startSubscriptions();
      }
    }
  }*/

  viewQuote(index) {
    this.activeLeads = [];
    this.activeLeads[ index ] = true;
  }

  bookmarkToggle(index, skuId) {
    if (this.bookmarkClicked[ index ]) {
      this.bookmarkClicked[ index ] = false;
      this._leadService.saveLeadAsBookmark(skuId, "OPEN").then(res => {
        // this.getNewLeads();
        this._router.navigate([ '/lead/new-lead' ]);
      });;
    }
    else {
      this.bookmarkClicked[ index ] = true;
      this._leadService.saveLeadAsBookmark(skuId, "ADD").then(res => {
        // this.getNewLeads();
        this._router.navigate([ '/lead/acted-lead' ]);
      });;
    }
  }

  DismissBtnClicked(skuId) {
    this._leadService.DismissLead(skuId, "DISMISS").then(res => {
      // this.getNewLeads();
      debugger
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}