import { Component, OnInit, Input } from '@angular/core';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { LeadListItemModel } from 'src/app/shared/models/leads';
import { RfqItem } from 'src/app/shared/models/rfq.models';
import { ActivatedRoute } from '@angular/router';
import { CatalogueFiltersComponent } from 'src/app/shared/dialogs/catalogue-filters/catalogue-filters.component';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { LeadFiltersComponent } from 'src/app/shared/dialogs/lead-filters/lead-filters.component';

@Component({
    selector: 'app-lead-list',
    templateUrl: './lead-list.component.html'
})
export class LeadListComponent implements OnInit {

    allLeads: RfqItem[];

    constructor(
        private activatedLeads: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.allLeads = this.activatedLeads.snapshot.data.leads;

    }





}
