import { Component, OnInit } from '@angular/core';
import { HEADER_NAV } from '../../constants';
import { HeaderNavigaton } from '../../models/header';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html'
})
export class SideNavigationComponent implements OnInit {
  headerNavBar: HeaderNavigaton[];

  constructor() { }

    ngOnInit(){
      this.headerNavBar = HEADER_NAV;
    }
}