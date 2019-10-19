import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { MatDialog } from '@angular/material';
import { ProfileVerifyComponent } from '../../dialogs/profile-verify/profile-verify.component';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html'
})
export class ProfileSidebarComponent implements OnInit, OnDestroy {
  
  profileSideBarDropDown;
  private userInfoUpdated: Subscription;
  user: UserModel;
  percentage: any;
  subscriptions: Subscription[] = [];
  profileVerfyStatus: boolean;
  // existPercentage: any;

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
    this.userService.getUserPercentage().then(res => {
        this.percentage = res;
    });

    this.startSubscriptions();
  }


  startSubscriptions(){
      this.subscriptions.push(
          this.userService.enableProfile$.subscribe(value => {
              if(value){                
                this.profileVerfyStatus = value;
              }
          }),

          /*this.userService.updatePercentage$.subscribe(value => {
            this.existPercentage = value;
          })*/
      )
  }
  /**
   * function to display popup after click on "Request" button in profile sidebar
   */
  requestToJoin(){
    if(this.user.sellerPersonalProfile.emailVerified != true){
        const d = this.dialog.open(ProfileVerifyComponent, {
            data: { userinfo:  this.user.sellerPersonalProfile },
            disableClose: true,
            panelClass: 'profile-verification-popup'
        });
    }else{
      this.userService.profileVerify(this.user.sellerPersonalProfile, this.user.sellerPersonalProfile.email).then(res => {
          this.userService.setUser(res.data);
      });
    }    
  }

  /**
   * @description function to get image if it disappears
   */
  getUserAPI() {
    this.userService.getUserData();
  }

  ngOnDestroy(){
    this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
    });
  }
}
