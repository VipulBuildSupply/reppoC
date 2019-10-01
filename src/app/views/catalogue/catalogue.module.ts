import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCatalogueComponent } from './add-catalogue/add-catalogue.component';
import { RouterModule } from '@angular/router';
import { catalogueRoutes } from './catalogue.routing';
import { AppSharedModule } from 'src/app/shared/app-shared.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddSkuComponent } from './add-sku/add-sku.component';
import { CataloguesList } from './catalogues-list/catalogues-list.component';



@NgModule({
  declarations: [
    AddCatalogueComponent,
    AddSkuComponent,
    CataloguesList
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppSharedModule,
    SharedComponentsModule,
    RouterModule.forChild(catalogueRoutes)
  ]
})
export class CatalogueModule { }
