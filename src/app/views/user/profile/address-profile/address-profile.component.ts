import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Address } from 'src/app/shared/models/address';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DeleteWarehouseAddressComponent } from 'src/app/shared/dialogs/delete-warehouse-address/delete-warehouse-address.component';

@Component({
    selector: 'app-address-profile',
    templateUrl: './address-profile.component.html'
})
export class AddressProfileComponent implements OnInit, OnDestroy {
    selectedProfile: any;
    constructor(private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router,
        private _dialog: MatDialog) { }

    addresses: Address[];
    addressType: string;
    // onDelete:EventEmitter<string> = new EventEmitter();

    subscriptions: Subscription[] = [];

    ngOnInit(): void {

        this.selectedProfile = this.userService.selectedProfile;

        this.userService.getUserData().then(res => {
            if(res.sellerPersonalProfile.hideRequestVerification == false){
                this.userService.enableProfile$.next(true);
            }
        });
        this.startSubscriptions();
    }

    startSubscriptions() {

        this.subscriptions.push(
            this.activatedRoute.params.subscribe(_ => {
                this.addresses = this.activatedRoute.snapshot.data.addresses;
                this.addressType = this.activatedRoute.snapshot.params.type;
            }),

            this.userService.editAddress$.subscribe((addrs: Address) => {

                this.userService.addressToEdit = addrs;
            }),

            this.userService.onProfileSwitch$.subscribe(_ => {
                const url = this.router.url
                this.router.navigateByUrl('blank').then(() => {
                    this.router.navigate([url]);
                })


            })

        );



    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(subs => subs.unsubscribe())

    }

    deleteAddrs(addressId: number): void {

        if(this.addressType === 'warehouse'){
            /**
             * Open popup if deleted address is warehouse address
             */
            const d = this._dialog.open(DeleteWarehouseAddressComponent, {
                data: { addressId: addressId, addresses: this.addresses },
                disableClose: true,
                panelClass: 'profile-verification-popup',
                width: '25%'
            });
            d.afterClosed().toPromise().then((data: any) => {
                if (data) {
                    this.addresses = data;
                    this.userService.getUserPercentage().then(res => this.userService.updatePercentage$.next(res));
                }
            });
        }else{

            /**
             * No popup when deleted address is billing address
             */
            this.userService.deleteAddress(addressId).then(res => {
                const deletedIndex = this.addresses.findIndex(addrs => addrs.addressId == addressId);
                this.addresses.splice(deletedIndex, 1);
                this.userService.getUserPercentage().then(res => this.userService.updatePercentage$.next(res));
            });
        }   
    }
}
