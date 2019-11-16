import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'delete-warehouse-address',
  templateUrl: './delete-warehouse-address.component.html'
})
export class DeleteWarehouseAddressComponent implements OnInit {

    addresses: any;
    addressId: any;
    bankAcc: any;

    constructor(public dialogRef: MatDialogRef<DeleteWarehouseAddressComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _userService: UserService) { }

    ngOnInit(){
      this.addressId = this.data.addressId;
      this.addresses = this.data.addresses;
    }

    /**
     * @description function to close popup window
     */
    closeDialog(): void {
      this.dialogRef.close(null);
    }


    delete(): void{
      this._userService.deleteAddress(this.addressId).then(res => {
          const deletedIndex = this.addresses.findIndex(addrs => addrs.addressId == this.addressId);
          this.addresses.splice(deletedIndex, 1);
          this.dialogRef.close(this.addresses);
      });
    }
}
