import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';
import { AddressTypes } from '../models/address';

@Injectable()

export class AddressService {


    constructor(
        private dataService: DataService
    ) { }


    getAddressList(addrType: AddressTypes) {
        return this.dataService.getRequest(API.GET_ADDRESS_LIST(addrType)).then(res => res.data);
    }
}
