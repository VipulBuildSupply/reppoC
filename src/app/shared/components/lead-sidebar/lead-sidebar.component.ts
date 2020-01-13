import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CustomDatePipe } from '../../directive/custom-date.pipe';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../services/category.service';

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

  constructor(private userService: UserService,
    private customdate: CustomDatePipe,
    private data: DataService,
    private _router: Router,
    private _categoryService: CategoryService) { }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    this.bookmarkClicked = [];
    this.activeLeads = [];
    this.startSubscriptions();

    if (this.submitQuoteMsg === "SUBMIT") {

      this.userService.getNewLeads().then(res => {

        this.new_leads = res.data;
        this.new_leadsTemp = res.data;
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');
        
        /*if (res) {
          if (res.data.length > 0) {
            this.new_leads = res.data;
            this.new_leadsTemp = res.data;
            this._router.navigate([`/lead`]);
          }
          else {
            this.data.changeMessage("ActedLeads");
          }

          this.data.changeSubmitQuoteMessage('NOTSUBMITTED');
        }
        else {
          this.data.changeMessage("ActedLeads");
        }*/

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
        this.userService.getNewLeads().then(res => {

          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
          // this._router.navigate([`/lead`]);

          /*if (res) {
            if (res.data.length > 0) {
              this.new_leads = res.data;
              this.new_leadsTemp = res.data;
              this._router.navigate([`/lead`]);
            }
            else {
              this.data.changeMessage("ActedLeads");
            }
          }
          else {
            this.data.changeMessage("ActedLeads");
          }*/

        });
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');

      }
      if (this.message == "ActedLeads") {
        this.userService.getActedLeads().then(res => {

          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
          // this._router.navigate([`/lead`]);

          /*if (res) {
            if (res.data.length > 0) {
              this.new_leads = res.data;
              this.new_leadsTemp = res.data;
              this._router.navigate([`/lead`]);
            }
            else {
              this.data.changeMessage("NewLeads");
            }
          }
          else {
            this.data.changeMessage("NewLeads");
          }*/

        });
        this.data.changeSubmitQuoteMessage('NOTSUBMITTED');
      }
    }
    if (this.message != undefined) {
      if (this.message === "NewLeads") {
        this.userService.getNewLeads().then(res => {

          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
          this.bookmarkClicked = [];
          // this._router.navigate([`/lead`]);
          // debugger

          /*if (res) {
            if (res.data.length > 0) {
              this.new_leads = res.data;
              this.new_leadsTemp = res.data;
              this.bookmarkClicked = [];
              this._router.navigate([`/lead`]);
            }
            else {
              this.data.changeMessage("ActedLeads");
            }
          }
          else {
            this.data.changeMessage("ActedLeads");
          }*/

        });
      }
      else if (this.message === "ActedLeads") {
        this.userService.getActedLeads().then(res => {

          this.new_leads = res.data;
          this.new_leadsTemp = res.data;
          this.bookmarkClicked = [];
          for (let i = 0; i < this.new_leads.length; i++) {
            if (this.new_leads[i].statusCd == "quote.request.sts.seller.add") {
              this.bookmarkClicked[i] = true;
            }
          }
          // this._router.navigate([`/lead`]);
          
          /*if (res) {
            if (res.data.length > 0) {
              this.new_leads = res.data;
              this.new_leadsTemp = res.data;
              this.bookmarkClicked = [];
              for (let i = 0; i < this.new_leads.length; i++) {
                if (this.new_leads[i].statusCd == "quote.request.sts.seller.add") {
                  this.bookmarkClicked[i] = true;
                }
              }
              this._router.navigate([`/lead`]);
            }
            else {
              this.data.changeMessage("NewLeads");
            }
          }
          else {
            this.data.changeMessage("NewLeads");
          }*/

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
      this.userService.saveLeadAsBookmark(skuId, "OPEN").then(res => {
        this.getNewLeads();
      });;
    }
    else {
      this.bookmarkClicked[index] = true;
      this.userService.saveLeadAsBookmark(skuId, "ADD").then(res => {
        this.getNewLeads();
      });;
    }
  }

  DismissBtnClicked(skuId) {
    this.userService.DismissLead(skuId, "DISMISS").then(res => {
      this.getNewLeads();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}