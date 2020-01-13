import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';
import { MultiItemCheckboxComponent } from './multi-item-checkbox/multi-item-checkbox.component';
import { DeliveryRequest } from 'src/app/shared/models/delivery-request';
import { UploadComponent } from 'src/app/shared/components/upload/upload.component';
import { LoggerService } from 'src/app/shared/services/logger.service';
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
  @ViewChildren(MultiItemCheckboxComponent) multiItems: QueryList<any>;
  @ViewChildren('uploadRef') uploadItems: QueryList<UploadComponent>;

  constructor(private _activatedRoute: ActivatedRoute,
    private _purchaseOrdersService: PurchaseOrdersService,
    private _formBuilder: FormBuilder,
    private _notify: NotificationService) { }

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
      invoiceAttachId: ['', Validators.required],
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

  submit() {

    const data: DeliveryRequest = this.deliveryRequestForm.value;

    Promise.all(this.uploadItems.map(comp => comp.uploadDocs('SELLER_PO_DELIVERY'))).then(res => {
      // upload all docs
      data.challanAttachId = res[0];
      data.ewayBillAttachId = res[1];
      data.invoiceAttachId = res[2];
      data.lorryReceiptAttachId = res[3];
      data.materialTestAttachId = res[4];

      data.eWayBillDate = data.eWayBillDate ? this.datePicker(this.deliveryRequestForm.value.eWayBillDate) : '';
      data.challanDate = data.challanDate ? this.datePicker(this.deliveryRequestForm.value.challanDate) : '';
      data.transportDate = data.transportDate ? this.datePicker(this.deliveryRequestForm.value.transportDate) : '';
      data.orderId = this.purchaseId;
  
      data.orderItemList = [];
  
      this.multiItems.map(opt => {
        if (opt.item.checked) {
          data.orderItemList.push({
            deliveryQty: opt.multiItemForm.value.deliveryQty,
            poItemId: opt.multiItemForm.value.poItemId
          });
        }
      });

      this.submitDeliveryRequest(data);
    });
  }

  datePicker(date) {
    return `${('0' + date.getDate()).slice(-2)}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
  }

  submitDeliveryRequest(data) {
    this._purchaseOrdersService.sendDeliveryRequest(this.purchaseId, data).then(res => {
      if (res.status == 1001) {
          this._notify.snack('Delivery Request Submitted Successfully!');
          // this.submitForm(res.status);
          // this.deliveryRequestForm.reset();
      }
    })
  }
}