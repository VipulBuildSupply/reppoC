import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';

@Injectable()

export class CategoryService {
    catalogue: any;

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

    setCatalogueCat(data){
        return this.dataService.sendPostRequest(API.GET_CATALOGUE_CATEGORIES, data).then((res: any) => res);
    }

    getCatalogueCat() {
        return this.dataService.getRequest(API.GET_CATALOGUE_CATEGORIES).then(res => res);
    }
}