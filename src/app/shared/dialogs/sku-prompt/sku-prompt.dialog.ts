import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PromptItem } from '../../models/leads';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-sku-prompt',
    templateUrl: './sku-prompt.dialog.html'
})
export class SkuPromptComponent implements OnInit, OnDestroy {
    constructor(

        public dialogRef: MatDialogRef<SkuPromptComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { items: PromptItem[], title: string, msg: string },
    ) { }

    ngOnInit(): void {

        CommonService.hideBodyOverFlow();
        CommonService.addScrollFixPopup();

    }

    ngOnDestroy(): void {
        CommonService.addBodyOverFlow();
        CommonService.removeScrollFixPopup();
    }
    submit() {
        this.dialogRef.close(true);
    }

    closeDialog(): void {
        this.dialogRef.close(false);
    }
}
