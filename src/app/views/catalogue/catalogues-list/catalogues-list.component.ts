import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-catalogues-list',
  templateUrl: './catalogues-list.component.html'
})
export class CataloguesList implements OnInit {

  catalogueList : any;
  uniqueCatalogueData : any;
  stockResponse : any;
  addAnotherRangeCount : any[] =[];
  addPriceForRemainingQuantity : boolean;


  constructor(private Userservice : UserService) { }

  ngOnInit() {
    this.addPriceForRemainingQuantity = false;
    this.addAnotherRangeCount.push('1');
    this.Userservice.getCatalogueItems().then(res => {
      if (res) {
        this.catalogueList = res.data;
       // console.log(this.catalogueList);
      }
    });
  }


  selectUniqueCatalogue(id){
    this.Userservice.getUniqueCatalogueItem(id).then(res => {
      if (res) {
        this.uniqueCatalogueData = res.data;
      }
    });
  }

  addAnotherRange(){
    this.addAnotherRangeCount.push('1');
  }
  addPriceForRemainingQty(event){
    if(event.target.checked){
      this.addPriceForRemainingQuantity = true;
    }
    else{
      this.addPriceForRemainingQuantity =false;
    }
  }


  toggleStock(event){
    if(event.target.checked){
      this.Userservice.toggleStockStatus(this.uniqueCatalogueData.catalogueItem.id, 'Y').then(res => {
        if (res) {
          this.stockResponse = res.data;
          this.Userservice.getCatalogueItems().then(res => {
            if (res) {
              this.catalogueList = res.data;
             // console.log(this.catalogueList);
            }
          });
        }
      });
    }
    else{
      this.Userservice.toggleStockStatus(this.uniqueCatalogueData.catalogueItem.id, 'N').then(res => {
        if (res) {
          this.stockResponse = res.data;
          this.Userservice.getCatalogueItems().then(res => {
            if (res) {
              this.catalogueList = res.data;
             // console.log(this.catalogueList);
            }
          });
        }
      });
    }
  }
}
