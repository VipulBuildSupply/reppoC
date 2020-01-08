import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-initiate-delivery',
  templateUrl: './initiate-delivery.component.html'
})
export class InitiateDeliveryComponent implements OnInit {
  purchaseId: number;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const poId = this._activatedRoute.snapshot.params;
    this.purchaseId = parseInt(poId.id);
  }

}