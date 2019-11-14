import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'delete-bank-details',
  templateUrl: './delete-bank-details.component.html'
})
export class DeleteBankDetailsComponent implements OnInit {

    profileVerifyForm: FormGroup;
    email: any;
    bankdetails: any;
    deleteId: any;
    bankAcc: any;

    constructor(public dialogRef: MatDialogRef<DeleteBankDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _userService: UserService) { }

    ngOnInit(){
      this.deleteId = this.data.deleteId;
      this.bankdetails = this.data.bankDetails;
      this.bankAcc = this.bankdetails.filter(bankdetails => bankdetails.id == this.deleteId);      
    }

    /**
     * @description function to close popup window
     */
    closeDialog(): void {
      this.dialogRef.close(null);
    }


    delete(): void{
      this._userService.deleteBankDetails(this.deleteId).then(res => {
          this.bankdetails = this.bankdetails.filter(bankdetails => bankdetails.id !== this.deleteId);
          this.dialogRef.close(this.bankdetails);
          // this._userService.getUserPercentage().then(res => this._userService.updatePercentage$.next(res));
      });
    }
}
