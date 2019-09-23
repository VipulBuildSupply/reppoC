import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Injectable()
export class RegisterGuardService implements CanActivate {

    constructor(private _categoryService: CategoryService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this._categoryService.getCatalogueCat().then(res => {
            //console.log(res);
            
        })
        return true;
        // if (!this._categoryService.getCatalogueCat().then) {
        //     this.router.navigate(['/']);
        //     return false;
        // }
        // return true;
    }
}