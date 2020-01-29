import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { UserReferences } from '../../models/reference';

@Component({
  selector: 'delete-reference',
  templateUrl: './delete-reference.component.html'
})
export class DeleteReferenceComponent implements OnInit {

  userReference: any;
  deleteId: any;
  reference: UserReferences;

  constructor(public dialogRef: MatDialogRef<DeleteReferenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _userService: UserService) { }

  ngOnInit() {
    this.deleteId = this.data.deleteId;
    this.userReference = this.data.userReference;
    this.reference = this.userReference.filter(ref => ref.id == this.deleteId);
  }

  /**
   * @description function to close popup window
   */
  closeDialog(): void {
    this.dialogRef.close(null);
  }

  delete(): void {
    this._userService.deleteReferences(this.deleteId).then(res => {
      if (res.status === 1001) {
        this.userReference = this.userReference.filter(ref => ref.id !== this.deleteId);
        this.dialogRef.close(this.userReference);
      }
    });
  }
}