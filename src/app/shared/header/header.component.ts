import { Component, OnInit } from '@angular/core';
import { SigninSignupService } from '../services/signin-signup.service';
import { UserService } from '../services/user.service';
import { UserModel } from '../models/user.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  profileDropdown;
  headerNavBar;
  selectedProfile: any;
  user: UserModel;
  private subscriptions: Subscription[] = [];

  constructor(private userService: UserService,
              private signinService: SigninSignupService,
              private router: Router) { }

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
      { name: 'My Orders', link: '' },
      { name: 'My RFQ', link: '' },
      { name: 'My Wishlist', link: '' },
      { name: 'Approval Requests', link: '' },
      { name: 'Settings', link: '' },
      { name: 'Help Centre', link: '' }
    ]

    this.headerNavBar = [
      // { name: 'Leads', link: '/user/profile/personal', imgUrl: 'assets/img/leads.png' },
      // { name: 'Orders', link: '', imgUrl: 'assets/img/order.png' }
      { name: 'Catalogue', link: '/../catalogue/add-catalogue', imgUrl: 'assets/img/catlogue.png' },
      // { name: 'PO', link: '', imgUrl: 'assets/img/po.png' }
    ]
  }

  ngOnInit() {

    this.startSubscriptions();
    
    if (this.signinService.isLoggedIn) {
        this.user = this.userService.user;        
    }
    this.getProfileDropdown();
  }

  startSubscriptions() {
    this.subscriptions.push(
        //? this subscription is used to check is any data update in user Object
        this.userService.userUpdated$.subscribe(usrData => {
            this.user = usrData;          
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
