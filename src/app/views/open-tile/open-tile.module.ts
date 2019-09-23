import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenTileRouting } from './open-tile.routing';
import { OpenTileComponent } from './open-tile.component';
import { CategoryService } from 'src/app/shared/services/category.service';

@NgModule({
  declarations: [
    OpenTileComponent
  ],
  imports: [
    CommonModule,
    OpenTileRouting
  ],
  exports: [],
  providers: [CategoryService],
})
export class OpenTileModule { }