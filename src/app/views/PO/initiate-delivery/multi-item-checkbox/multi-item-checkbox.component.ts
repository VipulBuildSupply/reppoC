import { Component, OnInit, Input } from '@angular/core';
import { OrderItemsList } from 'src/app/shared/models/purchase-orders';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';

@Component({
  selector: 'app-multi-item-checkbox',
  templateUrl: './multi-item-checkbox.component.html'
})
export class MultiItemCheckboxComponent implements OnInit {

  @Input('items') item: OrderItemsList;
  multiItemForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.formInit();
  }

  formInit(){
    this.multiItemForm = this._fb.group({
      deliveryQty: ['', {
        validators: [
          Validators.required,
          Validators.pattern(FieldRegExConst.QUANTITY_VALIDATION)
        ]
      }],
      poItemId: [this.item.id]
    });
  }
}