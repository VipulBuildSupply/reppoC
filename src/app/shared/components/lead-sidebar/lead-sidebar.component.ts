import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material';
import { CustomDatePipe } from '../../directive/custom-date.pipe';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-lead-sidebar',
  templateUrl: './lead-sidebar.component.html',
  providers: [CustomDatePipe]
})
export class LeadSidebarComponent implements OnInit {


  new_leads: any;
  bookmarkClicked: boolean[] = [];
  message: string;
  @Input() childMessage: string;

  constructor(private userService: UserService,
    private customdate: CustomDatePipe,
    private data: DataService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.bookmarkClicked = [];

    this.data.currentMessage.subscribe(message => this.message = message);
    this.getNewLeads();
  }


  getNewLeads() {
    if (this.message != undefined) {
      if (this.message === "NewLeads") {
        this.userService.getNewLeads().then(res => {
          this.new_leads = res;

          this.bookmarkClicked = [];
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


