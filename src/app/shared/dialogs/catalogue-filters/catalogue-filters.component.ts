import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from '../../constants';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'catalogue-filters',
  templateUrl: './catalogue-filters.component.html'
})
export class CatalogueFiltersComponent implements OnInit {

    profileVerifyForm: FormGroup;
    email: any;

    constructor(private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<CatalogueFiltersComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private userService: UserService,
      private notify: NotificationService) { }

    ngOnInit(){
    }

    /**
     * @description function to close popup window
     */
    closeDialog(): void {
      this.dialogRef.close(null);
    }
}
