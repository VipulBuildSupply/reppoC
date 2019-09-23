import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { UserModel } from 'src/app/shared/models/user.model';

@Injectable()

export class ProfileResolver implements Resolve<any> {

    constructor(private userService: UserService) {}

    resolve(route: ActivatedRouteSnapshot) {
        return this.userService.getUserData().then(res => {
            return this.userService.setUser(res as UserModel)
        }, err => {});
    }   
}