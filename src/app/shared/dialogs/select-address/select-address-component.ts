import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { Address } from '../../models/address';
import { Router } from '@angular/router';
@Component({
    selector: 'app-select-address',
    templateUrl: './select-address.component.html'
})
export class SelectAddressComponent implements OnInit {


    addresses: Address[];
    addressType: String;
    selectedAddress;
    addLink;
    addreErr;
    errMsg: string;
    selectedProfile: any;
    constructor(
        public dialogRef: MatDialogRef<SelectAddressComponent>,
        private userService: UserService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.selectedProfile = this.userService.selectedProfile;
        this.addressType = this.data.addressType;
        this.getAddrList();
        this.addLink = `/user/address/${this.addressType}/add`
    }

    getAddrList() {

        this.userService.getAddress(this.addressType.toUpperCase()).then(res => {
            this.addresses = res.data;

        })
    }
    closeDialog(): void {
        this.dialogRef.close(null);
    }

    addNewAddress() {
        this.closeDialog();
        if (this.router.url.indexOf('rfq') != -1) {
            this.dialogRef.close('add-address');
        } else {

            this.router.navigate([ this.addLink ]);
        }
    }

    submit() {

        if (this.addressType != "billing") {
                this.addreErr = false;
        }
        if (!this.addreErr) {
            this.dialogRef.close(this.selectedAddress);
        }


    }


}
