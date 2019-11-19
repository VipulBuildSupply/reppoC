import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-verification',
    templateUrl: './profile-verification.component.html'
})
export class ProfileVerificationComponent implements OnInit {

    user: UserModel;
    isUnverified: boolean;
    isPending: boolean;
    isVerified: boolean;
    new_leads: any;
    showleads: boolean;

    constructor(private _userService: UserService, private _router: Router) { }

    ngOnInit(): void {
        this.showleads = false;
        this._userService.getUserData().then(res => {
            if (res.sellerPersonalProfile.verifyStatus == "Unverified") {
                this.isUnverified = true;
            } else if (res.sellerPersonalProfile.verifyStatus == "Verification In Progress") {
                this.isPending = true;
            } else {
                this.isVerified = true;
            }
        });

        this._userService.getLeadsAll().then(res => {
            this.new_leads = res;
            if(this.new_leads.data.length > 0){
                this._router.navigate([`/lead`]);
            }else{
                this._router.navigate([`/profile-verification/status`]);
            }
           
        });

    }


}