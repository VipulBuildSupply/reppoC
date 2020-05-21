import { Component, OnInit, Input } from '@angular/core';
import { LeadListItemModel } from '../../models/leads';
import { RfqItem } from '../../models/rfq.models';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lead-list-item',
    templateUrl: './lead-list-item.component.html',
    animations: [
        trigger('slideInOut', [
            state('in', style({
                overflow: 'hidden',
                height: '*',
            })),
            state('out', style({
                opacity: '0',
                overflow: 'hidden',
                height: '0px',
            })),
            transition('in => out', animate('300ms ease-in-out')),
            transition('out => in', animate('300ms ease-in-out'))
        ])
    ]
})
export class LeadListItemComponent implements OnInit {

    @Input('item') rfqDetails: RfqItem;
    open = 'out';
    moreSku: any[];
    allLocations: string;

    leadType: 'new' | 'acted';

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.leadType = this.router.url.indexOf('new') !== -1 ? 'new' : 'acted';
        this.rfqDetails.rfq.statusCd = this.rfqDetails.rfq.expired ? '' : this.rfqDetails.rfq.statusCd;
        this.moreSku = this.rfqDetails ? this.rfqDetails.items.splice(2, this.rfqDetails.items.length) : [];
        // this.allLocations = this.rfqDetails ? this.rfqDetails.items.map(sku => sku.sellerRfqItem.deliveryLocation).join(', ') : '';

        this.allLocations = this.rfqDetails ? this.rfqDetails.items.map(sku => sku.sellerRfqItem.deliveryLocation).filter((loc, i, arr) => arr.indexOf(loc) === i).join(', ') : '';
    }
    toggle() {
        this.open = this.open === 'out' ? 'in' : 'out';
    }
}

