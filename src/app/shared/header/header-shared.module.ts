import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header.component';
import {
    MatAutocompleteModule, MatDatepickerModule, MatDialogModule, MatInputModule,
    MatSelectModule, MatStepperModule, MatTabsModule, MatMenuModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { SharedMaterialModule } from '../shared-material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatDialogModule,
        MatInputModule,
        MatStepperModule,
        MatTabsModule,
        MatMenuModule,
    ],
    declarations: [
        HeaderComponent
    ],
    exports: [
        HeaderComponent,
    ],
    providers: [],
    entryComponents: []
})
export class HeaderSharedModule {
}
