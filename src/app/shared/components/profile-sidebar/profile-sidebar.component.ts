import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { MatDialog } from '@angular/material';
import { ProfileVerifyComponent } from '../../dialogs/profile-verify/profile-verify.component';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html'
})
export class ProfileSidebarComponent implements OnInit {
  
  profileSideBarDropDown;
  private userInfoUpdated: Subscription;
  user: UserModel;
  percentage: any;
  // onUpdatePercentage: Subscription;

  constructor(private userService: UserService,
    private dialog: MatDialog) { }

  ngOnInit() {

    /**
     * @description get the user info
     */
    this.user = this.userService.user;
    
    // this.getProfilePercentage();

    /**
     * @description get the updated user info
     */
    this.userInfoUpdated = this.userService.userUpdated$.subscribe(user => {
        this.user = this.userService.user;    
    })


    // this.onUpdatePercentage = this.userService.updatePercentage$.subscribe(data => {
    //     this.getProfilePercentage();    
    // });

    /**
     * @description display profile sidebar menus on profile page
     */
    this.profileSideBarDropDown = [ 
      { name: 'Personal-Details', link: `/user/profile/personal` },
      { name: 'Business-Details', link: '/user/profile/business-details' },
      { name: 'Bank-Details', link: '/user/profile/bank-details' },
      { name: 'Billing-Addresses', link: '/user/profile/address/billing' },
      { name: 'Warehouse-Addresses', link: '/user/profile/address/warehouse' },
      { name: 'Change-Password', link: '/user/profile/reset-password' }
    ];

    /**
     * @description api to get profile percentage value
     */
    // getProfilePercentage(){
      this.userService.getUserPercentage().then(res => {
        this.percentage = res;
        // console.log(this.percentage);
      });
    // }
  }

  /**
   * function to display popup after click on "Request" button in profile sidebar
   */
  requestToJoin(){
    const d = this.dialog.open(ProfileVerifyComponent, {
        data: { userinfo:  this.user.sellerPersonalProfile },
        disableClose: true,
        panelClass: 'profile-verification-popup'
    });
  }

  /**
   * @description function to get image if it disappears
   */
  getUserAPI() {
    this.userService.getUserData();
  }
}
