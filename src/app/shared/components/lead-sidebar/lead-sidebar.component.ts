import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material';
import { CustomDatePipe } from '../../directive/custom-date.pipe';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lead-sidebar',
  templateUrl: './lead-sidebar.component.html',
  providers: [CustomDatePipe]
})
export class LeadSidebarComponent implements OnInit {


  new_leads: any;
  bookmarkClicked: boolean[] = [];
  message: string;
  submitQuoteMsg: string;
  @Input() childMessage: string;

  constructor(private userService: UserService,
    private customdate: CustomDatePipe,
    private data: DataService,
    private _router: Router,
    private dialog: MatDialog) { }

  ngDoCheck() {
    this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message);
    this.data.currentMessage.subscribe(message => this.message = message);

    if (this.submitQuoteMsg === "SUBMIT") {

      if (this.message === "NewLeads") {
        this.userService.getNewLeads().then(res => {
          this.new_leads = res;
          console.log(this.new_leads);
          this.data.changeSubmitQuoteMessage("NOTSUBMITTED");
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
  }
  ngOnInit() {
    this.bookmarkClicked = [];

    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.submitQuoteMsg.subscribe(message => this.submitQuoteMsg = message);

    if (this.submitQuoteMsg === "SUBMIT") {
      this.userService.getNewLeads().then(res => {
        this.new_leads = res;
        console.log(this.new_leads);
      });
    }

    this.getNewLeads();
  }

  getNewLeads() {
    if (this.submitQuoteMsg === "SUBMIT") {
      this.userService.getNewLeads().then(res => {
        this.new_leads = res;
        console.log(this.new_leads);
      });
    }
    if (this.message != undefined) {
      if (this.message === "NewLeads") {
        this.userService.getNewLeads().then(res => {
          this.new_leads = res;

          this.bookmarkClicked = [];
          this._router.navigate([`/lead`]);
        });
      } else if (this.message === "ActedLeads") {
        this.userService.getActedLeads().then(res => {
          this.new_leads = res;
          this.bookmarkClicked = [];
          for (let i = 0; i < this.new_leads.data.length; i++) {
            if (this.new_leads.data[i].statusCd == "quote.request.sts.seller.add") {
              this.bookmarkClicked[i] = true;
            }
          }

          this._router.navigate([`/lead`]);
        });
      }
    }


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


