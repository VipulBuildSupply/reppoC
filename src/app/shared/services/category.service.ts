import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';
import { Subject } from 'rxjs';

@Injectable()

export class CategoryService {

    getCatList: any;
    getCatIds: any[] = [];
    updateSkusList$ = new Subject<any>();
    selectedFiltersCount$ = new Subject<number>();
    updateLeadsSkusList$ = new Subject<any>();
    activeTab$ = new Subject<string>();

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

    /**
     * @description Get all filters of leads
     */

    getLeadsFilters(){
        return this.dataService.getRequest(API.GET_LEADS_FILTERS).then(res => {
            return res;
        });
    }

    getUpdatedSkusList(data){
        return this.dataService.getRequest(API.GET_UPDATED_SKUS_LIST, data).then(res => {
            return res;
        })
    }
}
