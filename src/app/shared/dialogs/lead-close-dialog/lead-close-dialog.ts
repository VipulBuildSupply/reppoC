import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'lead-close-dialog',
    templateUrl: './lead-close-dialog.html'
})
export class LeadCloseDialogComponent implements OnInit {

    leadCloseForm: FormGroup;
    isEdit: boolean;

    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fB: FormBuilder
    ) { }

    ngOnInit(): void {
        this.isEdit = this.data.remark ? false : true;
        this.formInit();
    }

    formInit(){
        this.leadCloseForm = this.fB.group({
            closeRemark: [ {value: (this.data.remark ? this.data.remark : ''), disabled: this.data.remark}]
        })
    }

    closeDialog(): void {
        this.dialogRef.close(null);
    }

    submit() {
        this.dialogRef.close(this.leadCloseForm.value);
    }
}
