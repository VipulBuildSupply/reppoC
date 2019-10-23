import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-profile-verification',
    templateUrl: './profile-verification.component.html'
})
export class ProfileVerificationComponent implements OnInit {

    user: UserModel;
    isUnverified: boolean;
    isPending: boolean;
    isVerified: boolean;

    constructor(private _userService: UserService) { }

    ngOnInit(): void {
        this._userService.getUserData().then(res => {
            if(res.sellerPersonalProfile.verifyStatus == "Unverified"){
                this.isUnverified = true;
            }else if(res.sellerPersonalProfile.verifyStatus == "Verification In Progress"){
                this.isPending = true;
            }else{
                this.isVerified = true;
            }
        });
        
    }
}