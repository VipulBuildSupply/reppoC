import { Component, OnInit } from '@angular/core';
import { Address, BankDetails } from 'src/app/shared/models/address';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
    selector: 'app-bank-details',
    templateUrl: './bank-details.component.html'
})
export class BankDetailsComponent implements OnInit {

    selectedProfile: any;
    constructor(private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private router: Router) { }

    bankdetails: BankDetails[];
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
                this.bankdetails = this.activatedRoute.snapshot.data.bankDetails;
                /// this.addressType = this.activatedRoute.snapshot.params.type;
            }),

            this.userService.editBankDetails$.subscribe((BankDetails: BankDetails) => {
                this.userService.bankDetailsToEdit = BankDetails;
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

    deleteBankDetails(id: number): void {
        this.userService.deleteBankDetails(id).then(res => {
            this.bankdetails = this.bankdetails.filter(bankdetails => bankdetails.id !== id);
            this.userService.getUserPercentage().then(res => this.userService.updatePercentage$.next(res));
        });
    }
}
