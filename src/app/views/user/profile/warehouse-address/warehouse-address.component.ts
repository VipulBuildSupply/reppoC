import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-warehouse-address',
  templateUrl: './warehouse-address.component.html'
})
export class WarehouseAddressComponent implements OnInit {
  addressProofAlreadyPresent: boolean;
  warehouseAdd: any;
  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
