import { Component, OnInit, Input } from '@angular/core';
import { SigninSignupService } from '../services/signin-signup.service';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { CommonService } from '../services/common.service';
import { HEADER_NAV } from '../constants';
import { HeaderNavigaton } from '../models/header';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  profileDropdown;
  headerNavBar: HeaderNavigaton[];
  selectedProfile: any;
  user: UserModel;
  private subscriptions: Subscription[] = [];
  @Input('menu') menu: MatSidenav;
  private routerParamsSubs: Subscription;

  constructor(private userService: UserService,
    private signinService: SigninSignupService,
    private router: Router) { }

  openMenu() {
    this.menu.open();
    CommonService.hideBodyOverFlow();
  }

  // Sub Menu Functionality
  // profileType() {
  //   return (this.selectedProfile ? this.selectedProfile.type : '').toLowerCase();
  // }

  /**
   * @description function to display dropdown menus in header after user logged in
   */

  getProfileDropdown() {

    this.profileDropdown = [
      { name: 'Profile', link: '/user/profile/personal' },
      // { name: 'My Orders', link: '' },
      // { name: 'My RFQ', link: '' },
      // { name: 'My Wishlist', link: '' },
      // { name: 'Approval Requests', link: '' },
      // { name: 'Settings', link: '' },
      // { name: 'Help Centre', link: '' }
    ]
  }

  ngOnInit() {
    this.startSubscriptions();
    if (this.signinService.isLoggedIn) {
      this.user = this.userService.user;
    }
    this.getProfileDropdown();
    this.headerNavBar = HEADER_NAV;
  }

  startSubscriptions() {
    this.subscriptions.push(
      //? this subscription is used to check is any data update in user Object
      this.userService.userUpdated$.subscribe(usrData => {
        this.user = usrData;
      }),

      this.routerParamsSubs = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          CommonService.smoothScrollToTop();
          if (this.menu.opened) {
            CommonService.addBodyOverFlow()
            this.menu.close();
          }
        }
      })

    );
  }

  logout() {
    this.signinService.logout();
  }

  getUserAPI() {
    // for user image update 
    console.log("user image updated");
    this.userService.getUserData();
  }
}
