import { Routes, RouterModule } from "@angular/router";
import { OpenTileComponent } from './open-tile.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'list',
            component: OpenTileComponent,
            data: { title: 'Open Tile' }
        }
    ]    
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class OpenTileRouting { }