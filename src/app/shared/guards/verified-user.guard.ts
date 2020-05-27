import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { stat } from 'fs';
import { LeadsService } from '../services/leads.service';

@Injectable()
export class VerifiedUserGuard implements CanActivate {

    constructor(
        private userService: UserService,
        private leadService: LeadsService,
        private router: Router) {
    }

    hasLead() {
        return this.leadService.hasLead().then(data => {
            return data || this.router.navigate([ 'leads-coming-soon' ]);
        });
    }

    getUserStatus(): Promise<'Unverified' | 'Verified' | 'Verification In Progress'> {
        if (this.userService.user && false) { // get latest data From API
            return Promise.resolve(this.userService.user.sellerPersonalProfile.verifyStatus);
        } else {
            return this.userService.getUserData().then((user) => {
                return this.userService.user.sellerPersonalProfile.verifyStatus;
            });
        }
    }

    checkStatus(): Promise<boolean> {
        return this.getUserStatus().then(status => {
            switch (status) {
                case 'Verified':
                    return this.hasLead();
                    break;
                case 'Unverified':
                    return this.router.navigate([ '/profile-verification/unverified' ]);
                    break;
                case 'Verification In Progress':
                    return this.router.navigate([ '/profile-verification/in-progress' ]);
                    break;
            }

        });
    }



    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.checkStatus();
    }
}