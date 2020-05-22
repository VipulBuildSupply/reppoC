import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../services/common.service';
import { AddressTypes, AddressModel } from '../../models/address';
import { AddressService } from '../../services/address.service';

@Component({
    selector: 'app-choose-address',
    templateUrl: './choose-address.html'
})
export class ChooseAddressDialogComponent implements OnInit, OnDestroy {

    allAddress: AddressModel[];
    selectedAddress: AddressModel;
    addressType: AddressTypes;
    constructor(
        private addressService: AddressService,
        public dialogRef: MatDialogRef<ChooseAddressDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { type: AddressTypes, id: number },
    ) { }

    ngOnInit(): void {
        this.addressType = this.data.type;
        this.getList(this.addressType);

        CommonService.hideBodyOverFlow();
        CommonService.addScrollFixPopup();
    }


    getList(type: AddressTypes) {
        this.addressService.getAddressList(type).then(data => {
            this.allAddress = data;
        });
    }

    addNewAddress() {
        this.dialogRef.close({ isAddNew: true, addressType: this.addressType });
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        CommonService.addBodyOverFlow();
        CommonService.removeScrollFixPopup();
    }

    closeDialog(): void {
        this.dialogRef.close(null);
    }

    submit(address?: any) {
        this.dialogRef.close({ address: this.selectedAddress, id: this.data.id });
    }
}
