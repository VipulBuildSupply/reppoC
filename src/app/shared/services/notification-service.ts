import { Injectable } from '@angular/core';
import { SnotifyService, SnotifyToastConfig, SnotifyPosition } from 'ng-snotify';
import { ConfigurationConstants } from '../constants/configuration-constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from '../components/snack/snack.component';

@Injectable()
export class NotificationService {

    constructor(private snotifyService: SnotifyService, private _snackBar: MatSnackBar) {
    }

    notify(message: string, title?: string, config?: SnotifyToastConfig) {
        config = (config) ? config : {};
        config.showProgressBar = false;
        config.pauseOnHover = true;
        // config.position = SnotifyPosition.centerTop;
        config.timeout = ConfigurationConstants.DEFAULT_NOTIFICATION_TIMEOUT;
        this.snotifyService.info(message, (title) ? title : null, config);

    }

    toast(message: string, title?: string, config?: SnotifyToastConfig) {
        config = (config) ? config : {};
        config.showProgressBar = false;
        config.pauseOnHover = true;
        config.position = SnotifyPosition.centerTop;
        config.animation = { enter: 'fadeIn', exit: 'fadeOut', time: 400 };
        config.timeout = ConfigurationConstants.DEFAULT_NOTIFICATION_TIMEOUT;
        this.snotifyService.info(message, (title) ? title : null, config);
    }

    snack(msg) {
        this._snackBar.openFromComponent(SnackComponent, {
            duration: 2 * 1000,
            data: { msg, verticalPosition: 'top' }
        });
    }

    clearAllNotifications() {
        this.snotifyService.clear();
    }
}
