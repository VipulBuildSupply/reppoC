import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Injectable()
export class StateResolver implements Resolve<any> {
    constructor(private userService: UserService) {
    }

    resolve(route: ActivatedRouteSnapshot) {


        return this.userService.getStates()
            .then((res: any) => res.data as any, (err: any) => { });
    }
}