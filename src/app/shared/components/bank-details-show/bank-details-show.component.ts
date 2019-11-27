import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BankDetails } from '../../models/address';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SellerPersonalProfile } from '../../models/user.model';

@Component({
    selector: 'app-bank-details-show',
    templateUrl: './bank-details-show.component.html'
})
export class BankDetailsShowComponent implements OnInit {

    selectedProfile: SellerPersonalProfile;
    addressType: string;
    @Input('bankDetail') bankDetail: BankDetails;
    @Output('onDelete') deleteBankDetails = new EventEmitter<number>();
    @Input('isOptions') isOptions: boolean;

    constructor(private _userService: UserService,
        private _router: Router,
        private userService: UserService) { }

    ngOnInit(): void {
        this.selectedProfile = this.userService.selectedProfile;
        this.isOptions = this.isOptions == false ? false : true;
    }

    edit() {
        this._userService.editBankDetails$.next(this.bankDetail);
        this._router.navigate(['user/profile/bank-details/edit']);
    }

    delete(id: number): void {
        this.deleteBankDetails.emit(id);
    }

    downloadBankDetailProof(signedUrl) {
        var win = window.open(signedUrl, '_blank');
        win.focus();
    }
}
