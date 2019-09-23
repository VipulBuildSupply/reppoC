import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { BankDetails } from 'src/app/shared/models/address';

@Injectable()
export class BankDetailsResolver implements Resolve<any> {

    constructor(private userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot) {

        return this.userService.getBankDetails()
            .then(res => res.data as BankDetails, err => {});
    }
}
