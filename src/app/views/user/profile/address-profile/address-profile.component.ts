import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Address } from 'src/app/shared/models/address';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-address-profile',
    templateUrl: './address-profile.component.html'
})
export class AddressProfileComponent implements OnInit, OnDestroy {
    selectedProfile: any;
    constructor(private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router) { }

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
        //console.log(this.selectedProfile);
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
        this.userService.deleteAddress(addressId).then(res => {
            const deletedIndex = this.addresses.findIndex(addrs => addrs.addressId == addressId);
            this.addresses.splice(deletedIndex, 1);
        });
    }
}
