import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';
import { MultiItemCheckboxComponent } from './multi-item-checkbox/multi-item-checkbox.component';
import { DeliveryRequest } from 'src/app/shared/models/delivery-request';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';
import { NotificationService } from 'src/app/shared/services/notification-service';

@Component({
  selector: 'app-initiate-delivery',
  templateUrl: './initiate-delivery.component.html'
})
export class InitiateDeliveryComponent implements OnInit {

  purchaseId: number;
  itemsList: any;
  deliveryRequestForm: FormGroup;
  documentName: any;
  minDate = new Date();
  inputFieldName: any;
  invoiceDocs: FileList;
  lorryDocs: FileList;
  transportMode: any;
  @ViewChildren(MultiItemCheckboxComponent) multiItems: QueryList<any>;
  @ViewChildren('uploadRef') uploadItems: QueryList<UploadComponent>;

  constructor(private _activatedRoute: ActivatedRoute,
    private _purchaseOrdersService: PurchaseOrdersService,
    private _formBuilder: FormBuilder,
    private _notify: NotificationService,
    private _router: Router) { }

  ngOnInit() {
    const poId = this._activatedRoute.snapshot.params;
    this.purchaseId = parseInt(poId.id);
    this.getAllItemsList(this.purchaseId);
    this.formInit();
  }

  getAllItemsList(oid) {
    this._purchaseOrdersService.getItemsList(oid).then(res => this.itemsList = res.data);
  }

  formInit() {
    this.deliveryRequestForm = this._formBuilder.group({
      invoiceNo: [''],
      invoiceAttachId: ['', {
        validators: [
          Validators.required,
          Validators.minLength(1)
        ]
      }],
      ewayBillNo: [''],
      eWayBillDate: [''],
      ewayBillAttachId: [''],
      challanNo: [''],
      challanDate: [''],
      challanAttachId: [''],
      materialTestAttachId: [''],
      transporterName: ['', Validators.required],
      transportModeCd: ['', Validators.required],
      vehicleNo: ['', Validators.required],
      driverName: ['', Validators.required],
      driverPhone: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(FieldRegExConst.PHONE)
        ]
      }],
      lorryReceiptNo: [''],
      transportDate: [''],
      lorryReceiptAttachId: ['', Validators.required]
    });
  }

  modeOfTransport(event) {
    this.transportMode = event.value;
  }

  submit() {

    const data: DeliveryRequest = this.deliveryRequestForm.value;

    Promise.all(this.uploadItems.map(comp => comp.uploadDocs('SELLER_PO_DELIVERY'))).then(res => {
      /**
       * @description upload all docs 
      */
      this.deliveryRequestForm.get('invoiceAttachId').setValue(res[0]);
      this.deliveryRequestForm.get('ewayBillAttachId').setValue(res[1]);
      this.deliveryRequestForm.get('challanAttachId').setValue(res[2]);
      this.deliveryRequestForm.get('materialTestAttachId').setValue(res[3]);
      this.deliveryRequestForm.get('lorryReceiptAttachId').setValue(res[4]);

      if (this.deliveryRequestForm.valid) {

        const deliveryObj: DeliveryRequest = this.deliveryRequestForm.value;
        deliveryObj.orderId = this.purchaseId;
        deliveryObj.transportModeCd = this.transportMode;
        deliveryObj.orderItemList = [];

        if (deliveryObj.eWayBillDate) {
          deliveryObj.eWayBillDate = this.datePicker(deliveryObj.eWayBillDate);
        }

        if (deliveryObj.challanDate) {
          deliveryObj.challanDate = this.datePicker(deliveryObj.challanDate);
        }

        if (deliveryObj.transportDate) {
          deliveryObj.transportDate = this.datePicker(deliveryObj.transportDate);
        }

        this.multiItems.map(opt => {
          if (opt.item.checked && opt.multiItemForm.value.deliveryQty != '' && opt.multiItemForm.value.deliveryQty != 0) {
            deliveryObj.orderItemList.push({
              deliveryQty: opt.multiItemForm.value.deliveryQty,
              poItemId: opt.multiItemForm.value.poItemId
            });
          }
        });

        if (this.deliveryRequestForm.value.orderItemList.length > 0) {
          /**
           * @description When form is valid then submit function will execute
           */
          this.submitDeliveryRequest(deliveryObj);
        } else {
          this._notify.snack("No item selected for delivery schedule");
        }
      } else {
        this._notify.snack("Please fill mandatory fields");
      }

    });
  }

  datePicker(date) {
    return `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
  }

  /**
   * 
   * @param data all form data related to delivery request form
   * @description function will submit the delivery request details and redirect to purchase details page
   */
  submitDeliveryRequest(data) {
    this._purchaseOrdersService.sendDeliveryRequest(this.purchaseId, data).then(res => {
      if (res.status == 1001) {
        this.goBack();
      }
    });
  }

  formatDate(d: any, to?: string): string {
    if (!d) {
      return 'DD/MM/YYYY';
    }
    let date: Date = new Date(d);
    if (to) {
      date = new Date(date + to);
    }
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  }

  invoiceDocUpdate(files: FileList) {
    this.invoiceDocs = files;
  }

  lorryDocUpdate(files: FileList) {
    this.lorryDocs = files;
  }

  goBack() {
    this._router.navigate(['/orders/details/awarded/' + this.purchaseId]);
  }
}