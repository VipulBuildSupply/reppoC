import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Router } from '@angular/router';

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

  constructor(private _categoryService: CategoryService,
    private _router: Router) { }

  ngOnInit() {
    /**
     * @description if api has category list then it will redirect to personal profile page
     */
    this._categoryService.getCatalogueCategories().then(res => {      
      if(res.data.length){        
          this._router.navigate(['/profile-verification/status']);
      }
    });

    /**
     * @description get all categories list
     */
    this._categoryService.getCategories().then((res: any) => {
      this.categories = res.data;
    }, (err: any) => {});
  }


  /**
   * @description getter - continue button disabled if no cateory is selected
   */
  get isDisabled(): boolean {
    return !this.categories.some(item => item.isSelected);
  }

  /**
   * @description function to get selected category value and id after 
   * click on continue button on catalogue page
   */
  continue() {
    const cats = this.categories.reduce((allCats, item) => {
      if (item.isSelected) {
        allCats.itemList.push(item.id);
      }
      return allCats;
    }, { itemList: [] });

    /**
     * @description to add selected categories in api and localstorage
     */
    this._categoryService.setCatalogueCategories(cats).then(res => res);
    this._router.navigate(['profile-verification/status']);
  }
}