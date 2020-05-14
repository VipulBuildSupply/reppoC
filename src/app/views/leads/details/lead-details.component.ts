import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RfqItem, RfqSku } from 'src/app/shared/models/rfq.models';
import { MatDialog } from '@angular/material';
import { ChooseAddressDialogComponent } from 'src/app/shared/dialogs/choose-address/choose-address';
import { AddressModel } from 'src/app/shared/models/address';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { TermModel, RfqSubmitModel, PromptItem } from 'src/app/shared/models/leads';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { item } from 'src/app/shared/models/item';
import { SkuPromptComponent } from 'src/app/shared/dialogs/sku-prompt/sku-prompt.dialog';

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
    leadType: 'new' | 'acted';
    isActedLead: boolean;
    constructor(
        private activatedRout: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private leadService: LeadsService) { }

    ngOnInit(): void {
        this.isActedLead = this.router.url.indexOf('new') === -1;
        this.details = this.activatedRout.snapshot.data.details;
        this.allLocations = this.details ? this.details.items.map(sku => sku.sellerRfqItem.deliveryLocation).filter((loc, i, arr) => arr.indexOf(loc) === i).join(', ') : '';
        this.details.items.forEach(item => item.form = this.formBuilder.group({ data: this.setForm(item) }));
        this.initCommonForm();
        this.getPaymentTerms();
        this.getFreightTerms();
    }


    initCommonForm(): void {
        let date = null;
        if (this.details.validEndDt) {

            const dtArr = this.details.validEndDt.split('-').map(n => Number(n));
            date = new Date((dtArr[ 2 ] - 1), (dtArr[ 1 ] - 1), dtArr[ 0 ]);
        }

        this.commonForm = this.formBuilder.group({
            paymentTermCd: [ { value: this.details.paymentTermCd, disabled: this.isActedLead }, Validators.required ],
            validEndDt: [ { value: date, disabled: this.isActedLead }, Validators.required ],
            freightTermCd: [ { value: this.details.freightTermCd, disabled: this.isActedLead }, Validators.required ]
        });
    }

    setForm(item: RfqSku): FormGroup | FormArray {

        const mainForm = (specId?): FormGroup => {
            // , { validators: [ Validators.required, Validators.pattern(FieldRegExConst.POSITIVE_NUMBERS) ] }
            const form = this.formBuilder.group({
                minQty: [ item.sellerRfqItem.requestQty ],
                note: [ '' ],
                price: [ '' ],
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
                return mainForm(spec.id);
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

                // tslint:disable-next-line: max-line-length
                itm.validEndDt = `${('0' + itm.validEndDt.getDate()).slice(-2)}-${itm.validEndDt.getMonth() + 1}-${itm.validEndDt.getFullYear()}`;

                return item;
            });

            const itemsWithoutPrice = items.filter(itm => !itm.price);
            if (itemsWithoutPrice.length) {
                this.showPopup(itemsWithoutPrice, items);
            } else {
                this.submitData(items);
            }



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

    submitData(items: RfqSubmitModel[]) {
        this.leadService.submitRfq(this.activatedRout.snapshot.params.id, items).then(data => {
            this.router.navigate([ '/lead/acted/list' ]);
        });
    }

    showPopup(itemsWithoutPrice: RfqSubmitModel[], allItems: RfqSubmitModel[]) {

        const promptItem: PromptItem[] = itemsWithoutPrice.map((item) => {

            const orgItm = this.details.items.find(itm => itm.sellerRfqItem.id === item.sellerRfqItemId);


            return { ...item, imageUrl: orgItm.sellerRfqItem.imageUrl, displayName: orgItm.sellerRfqItem.displayName };

        }) as PromptItem[];


        const popup = this.dialog.open(SkuPromptComponent, {
            data: {
                type: 'WAREHOUSE',
                items: promptItem,
                title: 'Submit Quote',
                msg: `<b>You have not mentioned the pricing for the below items in the lead.</b> 
            <br>
            Would you like to submit the lead response without filling the price for these items?
            `
            },
            disableClose: true,
            panelClass: 'custom-popup',
            maxWidth: '500px'
        });

        popup.afterClosed().toPromise().then((isSubmit: boolean) => {

            if (isSubmit) {
                this.submitData(allItems);
            }
        });

    }

    objToArr(obj) {
        const keys = [];
        for (let key in obj) {
            keys.push({ key: key, value: obj[ key ] });
        }
        return keys.filter(itm => itm.value).map((itm, i, arr) => {
            itm.total = arr.length;
            return itm;
        })
    }



}
