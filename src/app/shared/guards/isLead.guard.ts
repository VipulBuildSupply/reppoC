import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { stat } from 'fs';
import { LeadsService } from '../services/leads.service';

@Injectable()
export class HasLeadGuard implements CanActivate {

    constructor(
        private leadService: LeadsService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.leadService.hasLead().then(data => {
            return data || this.router.navigate([ 'leads-coming-soon' ]);
        })
    }
}