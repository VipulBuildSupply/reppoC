import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material';
import { CustomDatePipe } from '../../directive/custom-date.pipe';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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

  constructor(private userService: UserService,
    private customdate: CustomDatePipe,
    private data: DataService,
    private _router: Router,
    private dialog: MatDialog) { }

  ngDoCheck() {
    this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message);
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.searchLeads.subscribe(search => this.search = search);

    if (this.submitQuoteMsg === "SUBMIT") {

      if (this.message === "NewLeads") {
        this.userService.getNewLeads().then(res => {
          if (res) {
            if (res.data.length > 0) {
              this.new_leads = res;
              this.new_leadsTemp = res.data;
              this._router.navigate([`/lead`]);

              this.data.changeSubmitQuoteMessage("NOTSUBMITTED");
            }
            else {
              this.data.changeMessage("ActedLeads");
              this.data.changeSubmitQuoteMessage("NOTSUBMITTED");
            }
          }
          else {
            this.data.changeMessage("ActedLeads");
            this.data.changeSubmitQuoteMessage("NOTSUBMITTED");
          }

        });
      }
      else if (this.message === "ActedLeads") {
        this.userService.getActedLeads().then(res => {
          this.new_leads = res;
          console.log(this.new_leads);
          this.data.changeSubmitQuoteMessage("NOTSUBMITTED");
        });
      }

    }

    if (this.search != '' || this.search != null) {
      if (this.new_leads) {
        this.new_leads = this.new_leadsTemp.filter(item => {
          return item.skuName.toLowerCase().indexOf(this.search) != -1;
        });
      }

    } else {
      this.new_leads = this.new_leadsTemp;
    }
  }


  ngOnInit() {
    this.bookmarkClicked = [];
    this.activeLeads = [];
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message);
    this.data.searchLeads.subscribe(search => this.search = search);

    if (this.submitQuoteMsg === "SUBMIT") {
      this.userService.getNewLeads().then(res => {
        if (res) {
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
        }

      });
    }

    this.getNewLeads();
  }

  getNewLeads() {
    if (this.submitQuoteMsg === "SUBMIT") {
      this.userService.getNewLeads().then(res => {
        if (res) {
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
        }

      });
    }
    if (this.message != undefined) {
      if (this.message === "NewLeads") {
        this.userService.getNewLeads().then(res => {
          if (res) {
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
          }

        });
      } else if (this.message === "ActedLeads") {
        this.userService.getActedLeads().then(res => {
          if (res) {
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
          }

        });
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
}


