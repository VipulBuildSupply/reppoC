import { Component, OnInit, Input } from '@angular/core';
import { CustomDatePipe } from '../../directive/custom-date.pipe';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { LeadsService } from '../../services/leads.service';

@Component({
  selector: 'app-lead-sidebar',
  templateUrl: './lead-sidebar.component.html',
  providers: [CustomDatePipe]
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

  constructor(private data: DataService,
    private _categoryService: CategoryService,
    private _leadService: LeadsService) { }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    this.bookmarkClicked = [];
    this.activeLeads = [];
    this.startSubscriptions();

    if (this.submitQuoteMsg === "SUBMIT") {
      this._leadService.getNewLeads().then(res => {
        this.new_leads = res.data;
        this.new_leadsTemp = res.data;
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');
      });
    }

    this.getNewLeads();
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
      this.data.currentMessage.subscribe(message => this.message = message),
      this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message)
    )
  }

  getNewLeads() {
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
  }

  viewQuote(index) {
    this.activeLeads = [];
    this.activeLeads[index] = true;
  }

  bookmarkToggle(index, skuId) {
    if (this.bookmarkClicked[index]) {
      this.bookmarkClicked[index] = false;
      this._leadService.saveLeadAsBookmark(skuId, "OPEN").then(res => {
        this.getNewLeads();
      });;
    }
    else {
      this.bookmarkClicked[index] = true;
      this._leadService.saveLeadAsBookmark(skuId, "ADD").then(res => {
        this.getNewLeads();
      });;
    }
  }

  DismissBtnClicked(skuId) {
    this._leadService.DismissLead(skuId, "DISMISS").then(res => {
      this.getNewLeads();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}