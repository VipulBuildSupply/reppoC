import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
        if (res.data.success) {
          this.success = true;
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
        if (res.data.success) {
          this.success = true;
        }
      });
    }

  }

}