import { Component, OnInit, Input } from '@angular/core';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { LeadListItemModel } from 'src/app/shared/models/leads';
import { RfqItem } from 'src/app/shared/models/rfq.models';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-lead-list',
    templateUrl: './lead-list.component.html'
})
export class LeadListComponent implements OnInit {

    allLeads: RfqItem[];
    count: number;

    constructor(
        private leadService: LeadsService,
        private activatedLeads: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.allLeads = this.activatedLeads.snapshot.data.leads;

    }

    filters() { }
    applySearchFilter() { }
}
