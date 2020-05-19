import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Injectable()
export class CatalogueGuardService implements CanActivate {

    constructor(
        private _categoryService: CategoryService,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        return this._categoryService.getCatalogueCategories().then(res => {
            if (!res.data.length) {
                this.router.navigate([ '/open-tile/list' ]);
                return false;
            }
            return true;
        });

    }
}