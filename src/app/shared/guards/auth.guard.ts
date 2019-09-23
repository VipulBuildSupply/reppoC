import {Injectable} from '@angular/core';
import {Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { SigninSignupService } from '../services/signin-signup.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private signinService: SigninSignupService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.signinService.isLoggedIn) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}