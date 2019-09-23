import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html'
})
export class BusinessDetailsComponent implements OnInit {

  turnovers: any;
  businessType: any;

  constructor(private _userService: UserService) { }

  ngOnInit() {

    this._userService.annualTurnovers().then((res: any) => {
        this.turnovers = res;        
    }, (err: any) => {});

    this._userService.businessType().then((res: any) => {
        this.businessType = res;
    })

  }
}
