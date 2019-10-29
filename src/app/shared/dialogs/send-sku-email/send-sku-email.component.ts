import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from '../../constants';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'send-sku-email',
  templateUrl: './send-sku-email.component.html'
})
export class SendSkuEmailComponent implements OnInit {

  profileVerifyForm: FormGroup;
  email: any;
  success: any;
  constructor(public dialogRef: MatDialogRef<SendSkuEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    private Userservice: UserService,
    private notify: NotificationService) { }

  ngOnInit() {
    this.success = false;
  }

  addSkuOnEmail() {
    console.log(this.data.category);
    console.log(this.data.brands);


    let catID;

    if (this.data.category == undefined) {
      catID = 0;
    }
    else {
      catID = this.data.category;
    }

    console.log(this.data.brands);
    if (this.data.brands == undefined) {
      const data = {
        "addSku": true,
        "brandIds": [],
        "categoryId": catID
      }

      console.log(data);
      this.Userservice.sendSkuToEmail(data).then(res => {
        if (res.data.success == true) {
          this.success = true;
        }
        else {
          this.snack.open(res.data.message, 'OK', { duration: 3000 })
        }
      });

    } else {
      const data = {
        "addSku": true,
        "brandIds": this.data.brands,
        "categoryId": catID
      }
      console.log(data);
      this.Userservice.sendSkuToEmail(data).then(res => {
        if (res.data.success == true) {
          this.success = true;
        }
        else {
          this.snack.open(res.data.message, 'OK', { duration: 3000 })
        }
      });
    }

  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

}