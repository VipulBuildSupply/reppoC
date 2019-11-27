import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address } from '../../models/address';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SellerPersonalProfile } from '../../models/user.model';

@Component({
    selector: 'app-address',
    templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {

    selectedProfile: SellerPersonalProfile;
    addressType: string;
    @Input('address') address: Address;
    @Output('onDelete') deleteAddress = new EventEmitter<number>();
    @Input('isOptions') isOptions: boolean;

    constructor(private _userService: UserService,
        private _router: Router, private userService: UserService) { }
    
    ngOnInit(): void {
        this.selectedProfile = this.userService.selectedProfile;
        this.isOptions = this.isOptions == false ? false : true;
        this.addressType = this._router.url.split('/user/profile/address/')[1];
    }

    edit() {
        this._userService.editAddress$.next(this.address);
        this._router.navigate(['user/profile/address/' + this.addressType + '/edit']);
    }

    delete(id: number): void {
        this.deleteAddress.emit(id);
    }

    downloadAddressProof(signedUrl) {
        var win = window.open(signedUrl, '_blank');
        win.focus();
    }
}
