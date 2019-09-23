import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FooterComponent} from './footer.component';
import {MatSelectModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
    ],
    declarations: [
        FooterComponent
    ],
    exports: [
        FooterComponent,
    ],
    providers: [],
    entryComponents: []
})
export class FooterSharedModule {
}
