import { API } from './../../../shared/constants/configuration-constants';
import { DataService } from './../../../shared/services/data.service';
import { LeadCloseDialogComponent } from './../../../shared/dialogs/lead-close-dialog/lead-close-dialog';
import { LeadPriceResponse } from './../../../shared/models/leads';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RfqItem, RfqSku } from 'src/app/shared/models/rfq.models';
import { MatDialog } from '@angular/material';
import { ChooseAddressDialogComponent } from 'src/app/shared/dialogs/choose-address/choose-address';
import { AddressModel } from 'src/app/shared/models/address';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { TermModel, RfqSubmitModel, PromptItem } from 'src/app/shared/models/leads';
import { FormHelper } from 'src/app/shared/helpers/form-helper';
import { item } from 'src/app/shared/models/item';
import { SkuPromptComponent } from 'src/app/shared/dialogs/sku-prompt/sku-prompt.dialog';
import { CommonService } from 'src/app/shared/services/common.service';
import { AddAddressDialogComponent } from 'src/app/shared/dialogs/add-address/address.dialog';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import * as Sticky from 'sticky-js';

@Component({
    selector: 'app-lead-details',
    templateUrl: './lead-details.component.html'
})
export class LeadDetailsViewComponent implements OnInit, OnDestroy {
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
    sticky: any;
    leadPriceResponse: LeadPriceResponse;
    isLeadCloseAction: boolean;

    @ViewChild('formElm', { static: false }) public formElm: ElementRef;
    constructor(
        private activatedRout: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private leadService: LeadsService,
        private commonService: CommonService,
        private dataService: DataService) { }

    ngOnInit(): void {
        this.details = this.activatedRout.snapshot.data.details;

        this.details.rfq.statusCd = this.details.rfq.expired ? '' : this.details.rfq.statusCd;
        this.isActedLead = !!this.details.paymentTermCd || !!this.details.freightTermCd || !!this.details.validEndDt;
        this.allLocations = this.details ?
            this.details.items.map(sku => sku.sellerRfqItem.deliveryLocation)
                .filter((loc, i, arr) => arr.indexOf(loc) === i).join(', ') : '';
        this.details.items.forEach(item => item.form = this.formBuilder.group({ data: this.setForm(item) }));
        this.initCommonForm();
        this.getPaymentTerms();
        this.getFreightTerms();

        if (this.isActedLead) {
            this.details.items.forEach(itm => {
                if (itm.warehousePrice && itm.warehousePrice.warehouseAddress && itm.warehousePrice.warehouseAddress.htmlData) {
                    itm.warehousePrice.warehouseAddress.htmlData = this.formatAddress(itm.warehousePrice.warehouseAddress.htmlData);
                }
            });
        }

        this.isLeadCloseAction = this.details.rfq.closeRemark ? true : false

        this.sticky = new Sticky('.sticky');
        this.sticky.update();

        this.getLeadTotal();

    }

    showRemarks(remark){
        const d = this.dialog.open(LeadCloseDialogComponent, {
            data: { 
                remark
            },
            maxWidth: '100%',
            disableClose: true
        });
    }

    leadDialog(e){
        console.log(e);
        if(e.value === '1'){
            this.sendLeadClosedRequest(this.details.rfq.id, {closeYn : 'Y'});
        }
        if(e.value === '2'){
            const d = this.dialog.open(LeadCloseDialogComponent, {
                data: { },
                maxWidth: '360px',
                disableClose: true
            });
            d.afterClosed().toPromise().then((data: any) => {
                if (data) {
                    data.closeYn = 'N';
                    this.sendLeadClosedRequest(this.details.rfq.id, data);
                }
            });
        }
    }

    sendLeadClosedRequest(id, data){
        this.dataService.sendPutRequest(API.LEAD_CLOSEYN(id), data).then(res => {
            console.log(res.data);
            if(res.data){
                this.isLeadCloseAction = true;
            }
        })
    }


    formatAddress(addr): string {
        return (addr || '').replace('<br>', ' | ').replace('<br>', ' | ').split('<br>').join(', ');
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


        this.commonForm.get('paymentTermCd').valueChanges.subscribe(val => {

            if (val === 'bs.paymenterm.others') {
                this.commonForm.addControl('paymentTerm', this.formBuilder.control('', Validators.required));
            } else {
                if (this.commonForm.get('paymentTerm')) {
                    this.commonForm.removeControl('paymentTerm');
                }
            }
        })

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


            form.get('price').valueChanges.pipe(delay(300)).subscribe(value => {
                this.getLeadTotal();
                if (value) {
                    form.get('warehouseId').setValidators(Validators.required);

                } else {
                    form.get('warehouseId').clearValidators();
                }
                form.get('warehouseId').updateValueAndValidity();

            });

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

        addrPop.afterClosed().toPromise().then((data: { isAddNew: boolean, addressType: string; address: AddressModel, id: number }) => {

            if (data.isAddNew) {
                this.addAddress(data.addressType, id);
                return;
            }

            if (!data || !data.address) { return; }

            this.setAddress(data, id);

        });
    }

    setAddress(data, sellerRfqItemId) {
        const item: RfqSku = this.details.items.find(itm => itm.sellerRfqItem.id === sellerRfqItemId);

        item.selectedAddress = data.address;

        if (item.sellerRfqItem.specs.length) {
            const arr = item.form.get('data') as FormArray;
            this.setValueInAllItems(arr, 'warehouseId', data.address.addressId);
        } else {
            item.form.get('data').get('warehouseId').setValue(data.address.addressId);
        }
    }

    addAddress(addressType, sellerRfqItemId) {
        const data: any = { addressType };

        // const rfqDeliveryLocation = this.rfqItems.length ? this.rfqItems[0].selectedLocation.deliveryLocation : null;
        // const rfqLocationCode = this.rfqItems.length ? this.rfqItems[0].selectedLocation.deliveryLocationCd : null;
        // if(rfqLocationCode){
        //     data.rfqLocationCode = rfqLocationCode;
        // }
        // if(rfqDeliveryLocation){
        //     data.rfqDeliveryLocation = rfqDeliveryLocation;
        // }
        const d = this.dialog.open(AddAddressDialogComponent, {
            data,
            disableClose: true,
            maxWidth: '700px',
            panelClass: 'custom-popup-switch'
        });

        d.afterClosed().toPromise().then((data: any) => {

            if (data) {

                this.setAddress(data, sellerRfqItemId);
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
            // const itemsWithoutPrice = items.filter(itm => !itm.price);

            const itemHasPrice = items.filter(itm => itm.price);

            const itemsWithoutPrice = items.filter(itm => !itm.price);
            // .filter(itm => itemHasPrice.some(pItem => pItem.sellerRfqItemId !== itm.sellerRfqItemId));

            // const uniqItemsWithoutPrice = [ ...itemsWithoutPrice.reduce((a, c) => {
            //     a.set(c.sellerRfqItemId, c);
            //     return a;
            // }, new Map()).values() ];


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

            const itemNeedWarehouse = forms.findIndex((itmForm, i) => !itmForm.value.data.warehouseId);
            this.details.items.forEach((itm, i) => itm.expand = i === itemNeedWarehouse);

            const timer = setTimeout(() => {
                this.commonService.smoothScrollToElement({ element: this.formElm.nativeElement, className: '.mat-error' });
                clearTimeout(timer);
            }, 500);
        }
    }

    submitData(items: RfqSubmitModel[]) {

        items = items.filter(itm => itm.price);

        if (items.length) {
            this.leadService.submitRfq(this.activatedRout.snapshot.params.id, items).then(data => {
                this.router.navigate([ '/lead/acted/list' ]);
            });
        } else {
            this.router.navigate([ '/lead/new/list' ]);
        }
    }

    showPopup(itemsWithoutPrice: RfqSubmitModel[], allItems: RfqSubmitModel[]) {

        const promptItem: PromptItem[] = itemsWithoutPrice.map((item) => {
            let specName;
            const orgItm = this.details.items.find(itm => itm.sellerRfqItem.id === item.sellerRfqItemId);
            if (orgItm.sellerRfqItem.specs.length) {
                specName = orgItm.sellerRfqItem.specs.find(spec => spec.id === Number(item.specRelId)).specName;
            }

            return {
                ...item,
                imageUrl: orgItm.sellerRfqItem.imageUrl,
                displayName: orgItm.sellerRfqItem.displayName + (specName ? `(${specName})` : '')
            };

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
        return keys.filter(itm => itm.value && itm.key !== 'id' && itm.key !== 'sellerRfqItemId' && itm.key !== 'pid')
            .map((itm, i, arr) => {
                itm.total = arr.length;

                itm.value = itm.value === 'Y' ? 'Yes' : itm.value;
                itm.value = itm.value === 'N' ? 'No' : itm.value;

                itm.key = itm.key === 'pumpRequiredYn' ? 'Pump Required' : itm.key.replace(/([A-Z])/g, " $1");
                itm.key = itm.key.charAt(0).toUpperCase() + itm.key.slice(1);

                itm.key = itm.key.replace('Aggregate', 'Aggregate ');

                return itm;
            })
    }

    ngOnDestroy() {
        if (this.sticky) {
            this.sticky.destroy();
        }
    }
    getQty(item) {



        return item.sellerRfqItem.specs.reduce((total, spec, i) => {

            const isPrice = this.isActedLead ? spec.price : item.form.value.data[ i ].price;
            if (isPrice) {
                total += spec.requestQty;
            }
            return total;
        }, 0);

    }

    getTotal(item) {

        const total = (this.isActedLead ? item.sellerRfqItem.specs : item.form.value.data).reduce((totalP, spec, i) => {
            if (spec.price) {
                totalP = (item.sellerRfqItem.specs[ i ].requestQty * spec.price) + totalP;
            }
            return totalP;
        }, 0);


        return total;
    }

    // openItem(itemIndex: number) {
    //     this.details.items.forEach((itm, i) => itm.expand = i === itemIndex);
    // }

    noteFocus(ref: HTMLTextAreaElement) {
        // debugger;
        const timer = setTimeout(() => {
            ref.focus();
            clearTimeout(timer);
        }, 200);
    }

    getLeadTotal() {

        const sellerRfqItemId = this.details.items[ 0 ].sellerRfqItem.sellerRfqId;

        const data = this.details.items.reduce((priceArr, itm) => {

            if (!this.isActedLead) {
                if (Array.isArray(itm.form.value.data)) {
                    const items = itm.form.value.data
                        .map((spec, specIndex) => ({
                            price: spec.price,
                            specRelId: itm.sellerRfqItem.specs[ specIndex ].id,
                            sellerRfqItemId: itm.sellerRfqItem.id
                        }));

                    priceArr.push(...items.filter(itm => itm.price));
                } else if (itm.form.value.data.price) {
                    const priceItem = { price: itm.form.value.data.price, sellerRfqItemId: itm.sellerRfqItem.id };
                    priceArr.push(priceItem);
                }
            } else {
                if (Array.isArray(itm.sellerRfqItem.specs) && itm.sellerRfqItem.specs.length) {
                    const items = itm.sellerRfqItem.specs
                        .map((spec, specIndex) => ({
                            price: spec.price,
                            specRelId: itm.sellerRfqItem.specs[ specIndex ].id,
                            sellerRfqItemId: itm.sellerRfqItem.id
                        }));

                    priceArr.push(...items.filter(itm => itm.price));
                } else if (itm.sellerRfqItem.quotePrice) {
                    const priceItem = { price: itm.sellerRfqItem.quotePrice, sellerRfqItemId: itm.sellerRfqItem.id };
                    priceArr.push(priceItem);
                }

            }



            return priceArr;

        }, []);




        this.leadService.getLeadTotal(data, sellerRfqItemId).then(data => {
            this.leadPriceResponse = data;
            if (this.leadPriceResponse.quotes) {

                this.leadPriceResponse.totalQty = this.leadPriceResponse.quotes.reduce((total, itm) => {

                    total = itm.requestQty + total;
                    return total;
                }, 0);
            }
        });
    }

}
