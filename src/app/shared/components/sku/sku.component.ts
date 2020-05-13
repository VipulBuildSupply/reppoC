import { Component, OnInit, Input } from '@angular/core';
import { RfqSku } from '../../models/rfq.models';

@Component({
    selector: 'app-sku',
    templateUrl: './sku.component.html'
})
export class SkuComponent implements OnInit {

    @Input() sku: RfqSku;
    @Input() size: 'BIG' | 'SMALL';
    constructor(

    ) { }

    ngOnInit(): void {
        this.sku.sellerRfqItem.deliveryAddress = (this.sku.sellerRfqItem.deliveryAddress || '').replace('<br>', ' | ').replace('<br>', ' | ').split('<br>').join(', ')

    }

}
