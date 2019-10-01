import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { BusinessDetails } from 'src/app/shared/models/address';

@Injectable()
export class BusinessDetailsResolver implements Resolve<any> {

    constructor(private _userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        
        return this._userService.getBusinessDetails().then(res => res as BusinessDetails, 
            err => {});
    }
}