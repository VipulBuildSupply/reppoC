import { Component, OnInit, Input } from '@angular/core';
import { LoggerService } from '../../services/logger.service';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html'
})
export class ItemListComponent implements OnInit {

    @Input('itemList') items: any;
    @Input('selectedTab') activeTab: string;
    @Input('deliveryDetails') deliveryDetails: boolean;
    @Input('orderDetails') orderDetails: string;

    constructor() { }

    ngOnInit() {
        LoggerService.debug(this.items);
    }

}