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
import { ProfileSideBarMenus } from '../models/profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  profileDropdown: ProfileSideBarMenus[];
  headerNavBar: HeaderNavigaton[];
  user: UserModel;
  private subscriptions: Subscription[] = [];
  @Input('menu') menu: MatSidenav;
  private routerParamsSubs: Subscription;
  notificationsList: NotificationsList[];
  notiCount: number;

  constructor(private userService: UserService,
    private signinService: SigninSignupService,
    private router: Router) { }

  openMenu() {
    this.menu.open();
    CommonService.hideBodyOverFlow();
  }

  /**
   * @description function to display dropdown menus in header after user logged in
   */

  getProfileDropdown() {

    this.profileDropdown = [
      { name: 'Profile', link: '/user/profile/personal' }
    ]
  }

  ngOnInit() {
    this.startSubscriptions();
    if (this.signinService.isLoggedIn) {
      this.user = this.userService.user;
    }
    this.getProfileDropdown();
    this.headerNavBar = HEADER_NAV;
    this.user ? this.userNotifications() : '';
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
    this.userService.getUserData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
        subscription.unsubscribe();
    });
  }

  userNotifications(){
    this.userService.getUserNotifications().then(res => {
      this.notificationsList = res.data;
      this.notiCount = this.notificationsList.filter(msg => msg.read === false).length;
    });
  }
}
