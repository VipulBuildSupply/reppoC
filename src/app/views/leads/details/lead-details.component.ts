import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RfqItem, RfqSku } from 'src/app/shared/models/rfq.models';
import { MatDialog } from '@angular/material';
import { ChooseAddressDialogComponent } from 'src/app/shared/dialogs/choose-address/choose-address';
import { AddressModel } from 'src/app/shared/models/address';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { TermModel, RfqSubmitModel } from 'src/app/shared/models/leads';
import { FormHelper } from 'src/app/shared/helpers/form-helper';

@Component({
    selector: 'app-lead-details',
    templateUrl: './lead-details.component.html'
})
export class LeadDetailsViewComponent implements OnInit {
    details: RfqItem;
    moreSku: RfqSku[];
    allLocations: string;
    commonForm: FormGroup;
    noteObj = {};
    allPaymentTerms: TermModel[];
    allFright: TermModel[];
    today = new Date();
    constructor(
        private activatedRout: ActivatedRoute,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private leadService: LeadsService) { }

    ngOnInit(): void {

        this.details = this.activatedRout.snapshot.data.details;
        this.allLocations = this.details ? this.details.items.map(sku => sku.sellerRfqItem.deliveryLocation).join(', ') : '';
        this.details.items.forEach(item => item.form = this.formBuilder.group({ data: this.setForm(item) }));
        this.initCommonForm();
        this.getPaymentTerms();
        this.getFreightTerms();
    }


    initCommonForm(): void {

        this.commonForm = this.formBuilder.group({
            paymentTerm: [ '', Validators.required ],
            validEndDt: [ '', Validators.required ],
            freightTermCd: [ '', Validators.required ]
        });
    }

    setForm(item: RfqSku): FormGroup | FormArray {

        const mainForm = (specId?): FormGroup => {

            const form = this.formBuilder.group({
                minQty: [ item.sellerRfqItem.requestQty ],
                note: [ '' ],
                price: [ '', { validators: [ Validators.required, Validators.pattern(FieldRegExConst.POSITIVE_NUMBERS) ] } ],
                sellerRfqItemId: [ item.sellerRfqItem.id ],
                warehouseId: [ '' ],
            });

            if (specId) {
                form.addControl('specRelId', this.formBuilder.control(specId));
            }

            return form;

        };

        if (item.sellerRfqItem.specs.length) {
            const grpArr: FormGroup[] = item.sellerRfqItem.specs.map(spec => {
                return mainForm(spec.specId);
            });

            return this.formBuilder.array(grpArr);
        }

        return mainForm();
    }

    chooseAddr(id) {
        const addrPop = this.dialog.open(ChooseAddressDialogComponent, {
            data: { type: 'WAREHOUSE', id },
            disableClose: true,
            panelClass: 'custom-popup',
            maxWidth: '700px'
        });

        addrPop.afterClosed().toPromise().then((data: { address: AddressModel, id: number }) => {

            if (!data.address) { return; }
            const item: RfqSku = this.details.items.find(itm => itm.sellerRfqItem.id === data.id);

            item.selectedAddress = data.address;

            if (item.sellerRfqItem.specs.length) {
                const arr = item.form.get('data') as FormArray;
                this.setValueInAllItems(arr, 'warehouseId', data.address.addressId);
            } else {
                item.form.get('data').get('warehouseId').setValue(data.address.addressId);
            }

        });
    }


    setValueInAllItems(frmArr: FormArray, key: string, value: any) {
        for (let i = 0; i < frmArr.length; i++) {
            frmArr.at(i).get(key).setValue(value);
        }
    }

    addNotes(itemId: number, note: string) {

        const item: RfqSku = this.details.items.find(itm => itm.sellerRfqItem.id === itemId);

        if (item.sellerRfqItem.specs.length) {
            const arr = item.form.get('data') as FormArray;
            this.setValueInAllItems(arr, 'note', note);
        } else {
            item.form.get('data').get('note').setValue(note);
        }
    }

    getPaymentTerms() {
        this.leadService.showPaymentTerms().then((result) => {
            this.allPaymentTerms = result.data;
        });
    }

    getFreightTerms() {
        this.leadService.freightTerms().then((data) => {
            this.allFright = data;
        });
    }

    submit() {

        const forms: FormGroup[] = this.details.items.map(itm => itm.form);

        if (this.commonForm.valid && forms.every(frm => frm.valid)) {


            const items: RfqSubmitModel[] = this.details.items.map(itm => itm.form.value.data).flat().map(itm => {



                const item = Object.assign(itm, this.commonForm.value);

                itm.validEndDt = `${("0" + itm.validEndDt.getDate()).slice(-2)}-${itm.validEndDt.getMonth() + 1}-${itm.validEndDt.getFullYear()}`

                return item;
            });

            this.leadService.submitRfq(this.activatedRout.snapshot.params.id, items).then(data => {
                debugger
            })


        } else {
            FormHelper.validateAllFormFields(this.commonForm);
            forms.forEach(frm => {

                if (frm.value.data.specRelId) {
                    const arr = frm.get('data') as FormArray;
                    for (let i = 0; i < arr.length; i++) {
                        FormHelper.validateAllFormFields(arr.at(i) as FormGroup);
                    }
                } else {
                    FormHelper.validateAllFormFields(frm.get('data') as FormGroup);
                }

            });
        }
    }

}
