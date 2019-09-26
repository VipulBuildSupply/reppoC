import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-catalogue',
  templateUrl: './add-catalogue.component.html'
})
export class AddCatalogueComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
    
  }
  addSku(){
    this._router.navigate(['catalogue/add-sku']);
  }
}
