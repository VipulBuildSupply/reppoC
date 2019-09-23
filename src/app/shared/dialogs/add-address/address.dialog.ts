import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { LoggerService } from '../../services/logger.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-address-dialog',
    templateUrl: './address-dialog.html'
})
export class AddAddressDialogComponent implements OnInit, OnDestroy {

    constructor(
        public dialogRef: MatDialogRef<AddAddressDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void { 
        CommonService.hideBodyOverFlow();
        CommonService.addScrollFixPopup();
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

    submit(address:any){

       
        this.dialogRef.close({locationId:this.data.locationId, address});
    }
}
