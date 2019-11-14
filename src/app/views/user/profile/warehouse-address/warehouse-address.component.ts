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
    this.addressProofAlreadyPresent = false;
    this.userService.getAddress('WAREHOUSE').then(res => {
      this.warehouseAdd = res.data;
      this.checkAddressProof();
    })
  }
  checkAddressProof() {
    for (let i = 0; i < this.warehouseAdd.length; i++) {
      if (this.warehouseAdd[i].addressProofFile != null || this.warehouseAdd[i].addressProofFile != undefined || this.warehouseAdd[i].addressProofFile != "") {
        this.addressProofAlreadyPresent = true;
      }
    }
  }

}
