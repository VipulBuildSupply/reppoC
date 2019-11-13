import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { API } from '../constants';

@Injectable()

export class LeadsService {

    constructor(
        private dataService: DataService
    ) { }

    
}