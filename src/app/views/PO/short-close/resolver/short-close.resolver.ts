import { Injectable } from '@angular/core';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class ShortCloseResolver implements Resolve<any>  {

    constructor(
        private _purchaseOrderService: PurchaseOrdersService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this._purchaseOrderService.getPORequest(route.params.id).then(res => res);
    }

}