import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { UserReferences } from 'src/app/shared/models/reference';

@Injectable()
export class ReferenceResolver implements Resolve<any> {

    constructor(private userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot) {

        return this.userService.getReferences()
            .then(res => res.data as UserReferences, err => {});
    }
}