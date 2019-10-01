import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BankDetails } from '../../models/address';
import { UserService } from '../../services/user.service';
import {  Router } from '@angular/router';

@Component({
    selector: 'app-bank-details-show',
    templateUrl: './bank-details-show.component.html' 
})
export class BankDetailsShowComponent implements OnInit {
    selectedProfile: any;
    addressType: string;
    constructor(private _userService: UserService,
         private _router: Router, private userService: UserService) { }

    @Input('bankDetail') bankDetail:BankDetails;
    @Output('onDelete') deleteBankDetails = new EventEmitter<number>();
    @Input('isOptions') isOptions:boolean;
    ngOnInit(): void {
        this.selectedProfile = this.userService.selectedProfile;
        this.isOptions = this.isOptions == false ? false : true;
    //    this.addressType = this._router.url.split('/user/profile/address/')[1];
     //   console.log(this.addressType);
               
    }

    edit(){
        this._userService.editBankDetails$.next(this.bankDetail);
        this._router.navigate(['user/profile/bank-details/edit']);
    }

    delete(id:number):void{
        this.deleteBankDetails.emit(id);
    }

    downloadBankDetailProof(signedUrl){
        
                var win = window.open(signedUrl, '_blank');
                win.focus();
           
    }
}
