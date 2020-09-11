import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { isUndefined } from 'util';
import { DocumentModel } from '../../models/delivery-request';

@Component({
    selector: 'app-custom-confirmation',
    templateUrl: './custom-confirmation.component.html'
})
export class CustomConfirmationComponent implements OnInit, OnDestroy {


    showCloseButton = false;    // to show close button or not
    private langDataSubscription: Subscription;
    msg: string;
    title: string;
    payload: any;
    docs: DocumentModel[];
    constructor(
        public dialogRef: MatDialogRef<CustomConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,) {

        if (!isUndefined(this.data.showCloseButton)) {
            this.showCloseButton = this.data.showCloseButton;
        }


    }

    /* This alert will show text of this.data.message */
    ngOnInit() {
        this.title = this.data.title;
        this.msg = this.data.msg;
        this.payload = this.data.payload ? this.data.payload : '';
        this.docs = this.payload && this.payload.docs ? this.payload.docs : null;
        debugger;
    }

    ngOnDestroy() {

    }

    closeDialog(): void {
        this.dialogRef.close(false);
    }

    confirmAction() {
        this.dialogRef.close(this.payload);
    }
}
