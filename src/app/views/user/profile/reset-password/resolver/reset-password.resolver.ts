import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import {SigninSignupService} from '../../../../../shared/services/signin-signup.service'
import { UserService } from 'src/app/shared/services/user.service';


@Injectable()
export class ResetPasswordResolver implements Resolve<any> {

    constructor(private signinSignupService : SigninSignupService,
        private userService: UserService){}
    resolve(route: ActivatedRouteSnapshot) {
       
        return this.signinSignupService.createOTP(this.userService.user.phone)
            .then((res: any) => res as any, (err: any) => {});
    }
}