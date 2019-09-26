import { Routes } from "@angular/router";
import { AddCatalogueComponent } from './add-catalogue/add-catalogue.component';
import { AddSkuComponent } from './add-sku/add-sku.component';
import { CataloguesList } from './catalogues-list/catalogues-list.component';
export const catalogueRoutes: Routes = [
  {
    path: '',
        children: [
            {
                path: "add-catalogue",
                component: AddCatalogueComponent,
                data: { title: "Add Catalogue" }
            },
            {
              path: "add-sku",
              component: AddSkuComponent,
              data: { title: "Add Sku" }
          },
          {
            path: "catalogue-list",
            component: CataloguesList,
            data: { title: "Catalogue List" }
        }
    ]
  }
];