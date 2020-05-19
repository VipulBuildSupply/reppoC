import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LeadsService } from 'src/app/shared/services/leads.service';

@Injectable()
export class LeadResolver implements Resolve<any> {

    constructor(private leadService: LeadsService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        // const { companyId } = this.userService.user.buyerCorporateProfile;
        const params = route.url[ 0 ].path === 'new' ? '' : 'SUBMIT_FULL,SUBMIT_PARTIAL,SAVED';
        return this.leadService.getLeads(params)
            .then(leads => leads, err => { });
    }
}
