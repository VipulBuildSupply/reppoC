import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PurchaseOrdersService } from '../../services/purchase-orders.service';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-payment-initiate-request',
  templateUrl: './payment-initiate-request.component.html'
})
export class PaymentInitiateRequestComponent implements OnInit {

  @Input() orderNo: number;
  @Input() orderDate: number;
  @Input() orderId: number;
  @Input() poSummary: any;
  @Output() closePayReqBlock = new EventEmitter<boolean>();
  @ViewChild('uploadPaymentReqDoc', { static: false }) uploadPaymentReqDoc: UploadComponent;
  uploadFile: boolean;
  isSCAmount: number;

  constructor(
    private formBuilder: FormBuilder,
    private _purchaseOrderService: PurchaseOrdersService
  ) { }

  paymentReqForm: FormGroup;

  ngOnInit() {
    if (this.orderId) {
      this.initForm();
    }
  }

  initForm() {
    this.isSCAmount = this.poSummary.totalAmount ? this.poSummary.totalAmount - this.poSummary.requestedAmount : null;
    this.paymentReqForm = this.formBuilder.group({
      invoice: new FormControl(null),
      refId: new FormControl(this.orderId),
      refCd: new FormControl('payment.ref.seller.po'),
      attachId: new FormControl(null)
    });
    if (this.isSCAmount) {
      this.paymentReqForm.addControl('amount', this.formBuilder.control(null, Validators.compose([ Validators.required, Validators.min(1), Validators.max(this.isSCAmount) ])));
    } else {
      this.paymentReqForm.addControl('amount', this.formBuilder.control(null, Validators.compose([ Validators.required, Validators.min(1) ])));
    }
  }

  checkIfFileUpload(file: FileList) {
    file.length ? this.uploadFile = true : this.uploadFile = false;
  }

  clear() {
    this.closePayReqBlock.emit();
  }

  submit() {
    if (this.paymentReqForm.valid) {
      const data = this.paymentReqForm.value;
      if (this.uploadFile) {
        this.uploadPaymentReqDoc.uploadDocs('SELLER_PO_PAYMENT_REQUEST').then(ids => {
          data.attachId = ids;
          this.sendData(data);
        })
      } else {
        this.sendData(data);
      }
    }
  }

  sendData(data) {
    this._purchaseOrderService.initiatePaymentRequest(data).then(res => {
      if (res.data.success) {
        this.clear();
      }
    })
  }

}
