import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { PurchaseOrdersService } from 'src/app/shared/services/purchase-orders.service';
import { PoOrders, OrderItemsList } from 'src/app/shared/models/purchase-orders';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

// interface ShortCloseSubmitData {
//   orderItemList: OrderItemSubmitModel[],
//   remark: string
// }

// interface OrderItemSubmitModel {
//   closeQty: number,
//   poItemId: number
// }

@Component({
  selector: 'app-short-close',
  templateUrl: './short-close.component.html'
})
export class ShortCloseComponent implements OnInit {

  orders: PoOrders;
  activeTab: string;
  orderForm: FormGroup;
  oItemsList: FormArray;
  isRemarked: boolean;

  constructor(
    private _purchaseOrdersService: PurchaseOrdersService,
    private _activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.orders = this._activatedRoute.snapshot.data.orders.data;
    this.activeTab = this._activatedRoute.snapshot.params.id;

    // let bQtyItems = [];
    // this.orders.orderItemList.map(itm => {
    //   if (itm.deliverySummary.maxRaiseAllowQty) {
    //     bQtyItems.push(itm);
    //   }
    // });

    // this.orders.orderItemList = bQtyItems;

    this.initForms(this.orders);
  }

  initForms(order: PoOrders) {
    const allItems: FormGroup[] = order.orderItemList.map(item => {
      const bQty = Number(item.deliverySummary.orderRequestQty);
      const mQty = (Number(item.deliverySummary.maxRaiseAllowQty) < Number(item.deliverySummary.orderRequestQty)) ? Number(item.deliverySummary.orderRequestQty) : Number(item.deliverySummary.maxRaiseAllowQty);
      const itemForm = this.formBuilder.group({
        closeQty: new FormControl(bQty, Validators.compose([ Validators.max(mQty), Validators.min(1) ])),
        poItemId: new FormControl(item.id),
        isChecked: order.orderItemList.length === 1 ? true : false
      })
      return itemForm;
    })
    this.oItemsList = this.formBuilder.array(allItems);
    this.orderForm = this.formBuilder.group({
      remark: new FormControl('', Validators.required),
      orderItemList: this.formBuilder.array(allItems)
    })
    this.orderForm.setValidators(this.checkOrderItems);
  }

  checkOrderItems(form) {
    const hasCloseQty = form.value.orderItemList.some(item => {
      if (item.closeQty && item.isChecked) {
        return item.closeQty;
      }
    });
    return hasCloseQty ? null : { hasCloseQty };
  }

  enableInputs(event) {
    event.target.value !== '' ? this.isRemarked = true : this.isRemarked = false;
  }

  submit() {
    if (this.orderForm.valid) {
      let itemsListArr = [];
      this.orderForm.value.orderItemList.map(itm => {
        if (itm.isChecked && itm.closeQty) {
          delete itm.isChecked;
          itemsListArr.push(itm);
        }
      });
      const shortCloseData = this.orderForm.value;
      shortCloseData.orderItemList = itemsListArr;
      this._purchaseOrdersService.setShortCloseData(this.orders.purchaseOrder.id, shortCloseData).then(res => {
        if (res.success) {
          this.router.navigate([ '/orders/details/awarded/' + this.orders.purchaseOrder.id ]);
        }
      });
    }
  }

  cancel() {
    this.orderForm.reset();
    this.router.navigate([ '/orders/details/awarded/' + this.orders.purchaseOrder.id ]);
  }

}
