import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    /* this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
     });*/
  }


  footer_links(){
    CommonService.smoothScrollToTop();
  }

}
