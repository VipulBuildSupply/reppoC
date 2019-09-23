import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
    selector: 'app-snack',
    templateUrl: './snack.component.html'   
})
export class SnackComponent implements OnInit {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        
    }
}
