import { Routes } from "@angular/router";
import { PersonalProfileComponent } from "./personal-profile/personal-profile.component";
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { ProfileResolver } from './personal-profile/resolver/profile.resolver';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordResolver } from './reset-password/resolver/reset-password.resolver';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { AddressProfileComponent } from './address-profile/address-profile.component';
import { AddAddressComponent } from './address-profile/add-address/add-address.component';
import { AddressResolver } from './address-profile/resolver/address.resolver';
import { StateResolver } from './address-profile/add-address/resolver/states.resolver';
import { AddBankDetailsComponent } from './bank-details/add-bank-details/add-bank-details.component';
import { BankDetailsResolver } from './bank-details/resolver/bank-details.resolver';
import { BusinessDetailsResolver } from './business-details/resolver/business-details.resolver';

export const ProfileRoutes: Routes = [
    {
        path: "profile",
        children: [
            {
                path: "business-details",
                component: BusinessDetailsComponent,
                data: { title: "Business Details" },
                resolve: { business: BusinessDetailsResolver }
            },
            {
                path: "business-details/edit",
                component: BusinessDetailsComponent,
                data: { title: "Business Details" },
                resolve: { business: BusinessDetailsResolver }
            },
            {
                path: "personal",
                component: PersonalProfileComponent,
                data: { title: "Personal Profile" },
                resolve:{user: ProfileResolver}
            },
            { 
                path: 'personal/:type',
                component: PersonalProfileComponent,
                resolve:{user:ProfileResolver}
            },
            { 
                path: 'personal/:type/edit',
                component: PersonalProfileComponent
             },
            {
                path: "bank-details",
                component: BankDetailsComponent,
                data: { title: "Personal Profile" }, resolve: { bankDetails: BankDetailsResolver }
            },
            {
                path: 'bank-details/add',
                component: AddBankDetailsComponent
            },
            {
                path: 'bank-details/edit',
                component: AddBankDetailsComponent
            },
            // {
            //     path: "warehouse-address",
            //     component: WarehouseAddressComponent,
            //     data: { title: "warehouse-address" }
            // },
            {
                path: 'address/:type',
                component: AddressProfileComponent,
                resolve: { addresses: AddressResolver },
            }, {
                path: 'address/:type/add',
                component: AddAddressComponent,
                resolve: { states: StateResolver },
            }, {
                path: 'address/:type/edit',
                component: AddAddressComponent,
                resolve: { states: StateResolver },
            },
            {
                path: "reset-password",
                component: ResetPasswordComponent,
                resolve:{resetPass:ResetPasswordResolver},
                data: { title: "Reset Password" }
            }
        ]
    }
];
