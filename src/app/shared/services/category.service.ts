import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';

@Injectable()

export class CategoryService {

    getCatList: any;
    getCatIds: any[] = [];

    constructor(
        private dataService: DataService
    ) { }

    categories: any;

    getCategories() {
        return this.dataService.getRequest(API.GET_CATEOGORIES).then(res => {
            this.categories = res.data;
            return res;
        });
    }

    setCatalogueCategories(data){
        localStorage.setItem('SelectedCategories', JSON.stringify(data));
        return this.dataService.sendPostRequest(API.GET_CATALOGUE_CATEGORIES, data).then((res: any) => res);
    }

    getCatalogueCategories() {
        return this.dataService.getRequest(API.GET_CATALOGUE_CATEGORIES).then(res => {
            //this.getCatList = res.data;
            //this.getCatList.map(id => this.getCatIds.push(id.categoryId));
            //this.setCatalogueCategories(this.getCatList);
            // return this.setCatalogueCategories(this.getCatIds);
            return res;
        });
    }

    // get isCategories() {
    //     return localStorage.getItem('SelectedCategories') != null;
    // }

    // setCatalogueCategories(data){
    //     if(data){
    //         localStorage.setItem('SelectedCategories', JSON.stringify(data));
    //     }
    //     return this.dataService.sendPostRequest(API.GET_CATALOGUE_CATEGORIES, data).then((res: any) => res);
    // }

    // getCatalogueCategories() {
    //     return this.dataService.getRequest(API.GET_CATALOGUE_CATEGORIES).then(res => {
    //         return this.setCatalogueCategories(res.data);
    //     });
    // }

    removeCategories() {
        localStorage.removeItem('SelectedCategories');
    }
    
}