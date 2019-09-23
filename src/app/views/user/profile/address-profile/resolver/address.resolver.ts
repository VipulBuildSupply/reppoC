import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Address } from 'src/app/shared/models/address';

@Injectable()
export class AddressResolver implements Resolve<any> {

    constructor(private userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        // const { companyId } = this.userService.user.buyerCorporateProfile;
        const addressType = route.params.type.toUpperCase();

        return this.userService.getAddress(addressType)
            .then(res => res.data as Address, err => {});
    }
}
