import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { OtherCategoryComponent } from 'src/app/shared/dialogs/other-category/other-category.component';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'open-tile',
  templateUrl: './open-tile.component.html',
  styleUrls: []
})
export class OpenTileComponent implements OnInit {

  categories: Category[] = [];
  categoryIds: any = {
    "itemList": [],
    "customCategories": []
  }
  otherCategoryValue: string;
  // items: any;

  constructor(private _categoryService: CategoryService,
    private _router: Router,
    private _dialog: MatDialog) { }

  ngOnInit() {
    /**
     * @description if api has category list then it will redirect to personal profile page
     */
    this._categoryService.getCatalogueCategories().then(res => {
      if (res.data.length) {
        this._router.navigate([ '/profile-verification/status' ]);
      }
    });

    /**
     * @description get all categories list
     */
    this._categoryService.getCategories().then((res: any) => {
      this.categories = res.data;
    }, (err: any) => { });
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
        if (item.id != null) {
          allCats.itemList.push(item.id);
        } else {
          allCats.customCategories.push(item.name);
        }
      }
      return allCats;
    }, { itemList: [], customCategories: [] });

    /**
     * @description to add selected categories in api and localstorage
     */
    this._categoryService.setCatalogueCategories(cats).then(res => res);
    this._router.navigate([ '/lead' ]);
  }

  otherCategory() {
    const d = this._dialog.open(OtherCategoryComponent, {
      data: {},
      disableClose: true,
      panelClass: 'profile-verification-popup',
      width: '25%'
    });
    d.afterClosed().toPromise().then((data: any) => {
      if (data) {
        this.otherCategoryValue = data;
        this.categories.push({ id: null, name: this.otherCategoryValue, isSelected: true, isDisable: true });
      }
    });
  }
}