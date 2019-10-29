import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from '../../constants';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';
import { AddBulkFile } from '../../models/address';

@Component({
  selector: 'send-bulk-catalogue-email',
  templateUrl: './send-bulk-catalogue-email.component.html'
})
export class SendBulkCatalogueEmailComponent implements OnInit {

  profileVerifyForm: FormGroup;
  email: any;
  success: any;
  fileForm: FormGroup;
  addBulkFIle: AddBulkFile;
  fileName: any;

  constructor(public dialogRef: MatDialogRef<SendBulkCatalogueEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private Userservice: UserService,
    private notify: NotificationService) { }

  ngOnInit() {
    this.success = false;
    this.fileName = null;
    this.fileForm = this._formBuilder.group({
      file: ['']
    });

  }
  onFileSelected(event) {
    if (event.target.files.length > 0) {
      // console.log(event.target.files[0].name);
      this.fileName = event.target.files[0].name;
      const file = event.target.files[0];
      this.fileForm.get('file').setValue(file);

    }
  }

  closeFileDiv(event) {
    //   $(event).parent().remove();
    event.currentTarget.parentNode.remove();
    this.fileName = null;
    this.success = false;
  }

  UploadFile() {

    if (this.fileName != undefined) {
      // console.log("submit called und:: " + this.fileName);
      const formData = new FormData();
      formData.append('file', this.fileForm.get('file').value);

      //console.log("submit Filev called und:: " + this.fileForm.get('file').value);

      this.Userservice.updateFileBulkCat(formData).then(res => {

        if (res.success == true) {
          this.success = true;
          this.snack.open(res.message, 'OK', { duration: 3000 });
        }
        else {
          this.success = false;
          this.snack.open(res.message, 'OK', { duration: 3000 })
        }
      }, err => { });
    }
    else {
      this.success = false;
    }

  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

}