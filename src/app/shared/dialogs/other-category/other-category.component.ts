import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'other-category',
  templateUrl: './other-category.component.html'
})
export class OtherCategoryComponent implements OnInit {

  otherCategoryForm: FormGroup;
  otherCategoryName: string;

  constructor(public dialogRef: MatDialogRef<OtherCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.otherCategoryForm = this._formBuilder.group({
      otherCategoryName: ['', {
        validators: [
          Validators.required
        ]
      }]
    })
  }

  /**
   * @description function to close popup window
   */
  closeDialog(): void {
    this.dialogRef.close(null);
  }

  create() {
    if (this.otherCategoryForm.valid) {
      this.otherCategoryName = this.otherCategoryForm.controls.otherCategoryName.value;
      this.dialogRef.close(this.otherCategoryName);
    }
  }
}