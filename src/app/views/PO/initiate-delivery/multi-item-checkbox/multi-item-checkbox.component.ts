import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderItemsList } from 'src/app/shared/models/purchase-orders';
import { LoggerService } from 'src/app/shared/services/logger.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldRegExConst } from 'src/app/shared/constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-multi-item-checkbox',
  templateUrl: './multi-item-checkbox.component.html'
})
export class MultiItemCheckboxComponent implements OnInit {

  @Input('items') item: OrderItemsList;
  @Output() valueChange = new EventEmitter();
  multiItemForm: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.multiItemForm = this._fb.group({
      deliveryQty: [ '', {
        validators: [
          Validators.required,
          // Validators.max(this.item.deliverySummary.maxRaiseAllowQty),
          Validators.pattern(FieldRegExConst.DECIMAL_NUMBERS)
        ]
      } ],
      poItemId: [ this.item.id ]
    });

    this.multiItemForm.get('deliveryQty').valueChanges.pipe(debounceTime(300)).subscribe(val => {
      this.valueChange.emit(val);
    });
  }
}