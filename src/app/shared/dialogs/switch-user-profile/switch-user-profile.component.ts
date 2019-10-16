import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst, API } from '../../constants';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';
import { TokenService } from '../../services/token.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'switch-user-profile',
  templateUrl: './switch-user-profile.component.html'
})
export class SwitchUserProfileComponent implements OnInit {

    profileVerifyForm: FormGroup;
    email: any;

    constructor(private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<SwitchUserProfileComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private userService: UserService,
      private notify: NotificationService,
      private _token: TokenService,
      private _dataService: DataService,
      private _router: Router) { }

    ngOnInit(){
      //console.log(this.data.userData);
    }

    /**
     * @description function to close popup window
     */
    closeDialog(): void {
      this.dialogRef.close(null);
    }

    confirmAction() {
        this._token.saveAccessToken(this.data.userData.jwtToken);
        this.userService.isBuyer(this.data).then(res => {
            this.userService.getUserData();
            return this.isSignedIn();
        });
    }

    isSignedIn(){
        this.closeDialog();
        this._router.navigate(['/user/profile/personal']);
    }
    /*signedIn(){
      this.userService.getUserData();
      this._dataService.sendPostRequest(API.SIGNIN, data).then(res => {
          this._router.navigate(['/user/profile/personal']);
      }
    }*/
}
