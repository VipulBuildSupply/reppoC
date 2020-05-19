import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LeadsService } from 'src/app/shared/services/leads.service';

@Injectable()
export class DetailsResolver implements Resolve<any> {

    constructor(private leadService: LeadsService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        // const { companyId } = this.userService.user.buyerCorporateProfile;
        const id = Number(route.params.id);
        return this.leadService.getLeadDetails(id)
            .then(leadDetails => leadDetails, err => { });
    }
}
