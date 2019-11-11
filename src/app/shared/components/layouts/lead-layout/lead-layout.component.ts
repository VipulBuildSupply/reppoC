import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-lead-layout',
  templateUrl: './lead-layout.component.html'
})
export class LeadLayoutComponent implements OnInit {
  new_tab = "inactive";
  acted_tab = "inactive";

  message: string;


  constructor(private data: DataService) { }

  ngOnInit() {
    this.new_tab = "active-tab";
    this.acted_tab = "inactive-tab";

    this.data.currentMessage.subscribe(message => this.message = message);
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


}