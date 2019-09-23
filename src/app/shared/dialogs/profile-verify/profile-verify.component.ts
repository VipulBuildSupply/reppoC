import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from '../../constants';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'profile-verify',
  templateUrl: './profile-verify.component.html'
})
export class ProfileVerifyComponent implements OnInit {

    profileVerifyForm: FormGroup;
    email: any;

    constructor(private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<ProfileVerifyComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private userService: UserService,
      private notify: NotificationService) { }

    ngOnInit(){

      this.email = this.data.userinfo.email;

      this.profileVerifyForm = this._formBuilder.group({
          emailAddress: [this.email ? this.email : null,
          {
              validators: [
                  Validators.required,
                  Validators.pattern(FieldRegExConst.EMAIL),
              ]
          }],
      });
    }

    /**
     * @description function to close popup window
     */
    closeDialog(): void {
      this.dialogRef.close(null);
    }

    /**
     * @description function to submit the profile verification form
     */
    submit(){
      if(this.profileVerifyForm.valid){

          if(this.email == undefined || this.email == null || this.email == ''){
            this.email = this.profileVerifyForm.controls.emailAddress.value;
          }

          this.userService.profileVerify(this.data, this.email).then(res => {
              this.notify.snack('A verification mail sent to your registered Email ID!');
              this.closeDialog();
              this.userService.setUser(res.data);
          });
      }
    }
}
