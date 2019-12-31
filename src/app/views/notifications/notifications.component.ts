import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: []
})
export class NotificationsComponent implements OnInit {

  notificationsList: NotificationsList[];
  notiCount: number;

  constructor(private _userService: UserService){}

  ngOnInit(){
      this.userNotifications();
  }

  userNotifications(){
    this._userService.getUserNotifications().then(res => {
      this.notificationsList = res.data;
      this.notiCount = this.notificationsList.filter(msg => msg.read === false).length;
    });
  }
}