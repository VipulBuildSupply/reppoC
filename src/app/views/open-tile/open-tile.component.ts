import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'open-tile',
  templateUrl: './open-tile.component.html',
  styleUrls: []
})
export class OpenTileComponent implements OnInit {

  categories: any[] = [];
  items: any;
  categoryIds: any = {
    "itemList": []
  }

  constructor(private _categoryService: CategoryService) { }

  ngOnInit() {
    this._categoryService.getCategories().then((res: any) => {
      this.categories = res.data;
    }, (err: any) => {
    });
  }

  get isDisabled(): boolean {
    return !this.categories.some(item => item.isSelected);
  }

  /**
   * @description function to get selected category value and id
   */
  continue() {
    const cats = this.categories.reduce((allCats, item) => {
      if (item.isSelected) {
        allCats.itemList.push(item.id);
      }
      return allCats;
    }, { itemList: [] });
    this.setCatalogueCategories(cats);
  }

  setCatalogueCategories(cat) {
    this._categoryService.setCatalogueCat(cat).then((res: any) => {
      console.log(res);
    })
  }

}