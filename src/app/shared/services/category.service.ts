import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';
import { Subject } from 'rxjs';

@Injectable()

export class CategoryService {

    getCatList: any;
    getCatIds: any[] = [];
    updateSkusList$ = new Subject<any>();

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
        localStorage.getItem('SelectedCategories');
        return this.dataService.getRequest(API.GET_CATALOGUE_CATEGORIES).then(res => {
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

    getCatalogueFilters(){
        return this.dataService.getRequest(API.GET_CATALOGUE_FILTERS).then(res => {
            return res;
        });
    }
    
    getFilteredSkus(data){
        return this.dataService.sendPostRequest(API.GET_FILTERED_SKUS, data).then(res => res);
    }
}