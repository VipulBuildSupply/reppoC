import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog } from '@angular/material';
import { LeadFiltersComponent } from 'src/app/shared/dialogs/lead-filters/lead-filters.component';

@Component({
  selector: 'app-lead-layout',
  templateUrl: './lead-layout.component.html'
})
export class LeadLayoutComponent implements OnInit {
  new_tab = "inactive";
  acted_tab = "inactive";

  message: string;
  selectedFilters: any;


  constructor(private data: DataService,
    private _dialog: MatDialog) { }

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

  filters() {
    const d = this._dialog.open(LeadFiltersComponent, {
      data: { selectedFiltersData: this.selectedFilters },
      disableClose: true,
      panelClass: 'catalogue-filters-popup',
      height: '90vh'
    });
    d.afterClosed().toPromise().then((data: any) => {
      if (data) {
        this.getAllSelectedFilters(data);
      }
    });
  }

  getAllSelectedFilters(filters) {
    this.selectedFilters = filters;
  }


}
