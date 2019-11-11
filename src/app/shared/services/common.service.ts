import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {ConfigurationConstants} from '../constants';
import {TokenService} from './token.service';
import {HttpParams} from '@angular/common/http';
import {DataServiceOptions} from '../models/data-service-options';
import {Utils} from '../helpers/utils';
import {isUndefined} from 'util';
import * as _ from 'lodash';
import {Subject} from 'rxjs';
import * as $ from 'jquery';
import { SigninStepper } from '../models/signin-stepper';

@Injectable()
export class CommonService {



    /* subscribe to langChanged observable to get event whenever language changed */
    private langChangedEv = new Subject<boolean>();
    public isHeaderVisible = new Subject<boolean>();
    langChanged$ = this.langChangedEv.asObservable();

    signinSteper = new Subject<SigninStepper>();
    otmTimer = new Subject<boolean>();

    constructor(private dataService: DataService, private token: TokenService) {

    }

    // static closeMenu() {
    //     HamburgerMenuService.hideMenu();
    // }



    static addBodyOverFlow() {
        $('body').removeClass('overflowHidden');
    }

    static hasBodyOverFlowHidden() {
        return $('body').hasClass('overflowHidden');
    }

    static hideBodyOverFlow() {
        $('body').addClass('overflowHidden');
    }

    static smoothScrollToTop() {
        $('html, body').animate({scrollTop: 0}, 500);
    }

    static smoothScrollTo(element: any, fromStart = true, extraOffset = 50) {
        const headerSpacerHeight = $('.header__spacer').height() || 0;
        const cartHeaderHeight = $('app-cart-header .di__wrapper').height() || 0;
        const sideNavElHgt = $('app-menu-side-nav').height() || 0;
        const skipHeight = headerSpacerHeight + cartHeaderHeight + sideNavElHgt + extraOffset;
        $('html, body').stop().animate({
            scrollTop: ((fromStart) ? element.offset().top - skipHeight :
                ((element.offset().top + element.outerHeight()) - skipHeight))
        }, 500);
    }

    // static setItemsDetails(items: CartItem[]): void {
    //     (items || []).forEach(item => {
    //         CommonService.setItemDetail(item);
    //     });
    // }


    static closeMiniBag() {
        $('.minibag__wrapper').addClass('hide');
    }


    static addScrollFixPopup(){
        $('.cdk-overlay-container').addClass('popupScrollFix');
    }

    static removeScrollFixPopup(){
        $('.cdk-overlay-container').removeClass('popupScrollFix');
    }


    // it is publishing this value to all the subscribers that have already subscribed to this message
    isHeaderFooterVisible(value: boolean) {
        this.isHeaderVisible.next(value);
    }

    // getStates() {
    //     return this.dataService.getRequest(`country/${ConfigurationConstants.DEFAULT_COUNTRY_ID}/states`, null)
    //         .then(data => data.data as any, err => {
    //             throw err;
    //         });
    // }

    // getCities(stateId) {
    //     return this.dataService.getRequest(`state/${stateId}/cities`, null)
    //         .then(data => data.data as any, err => {
    //             throw err;
    //         });
    // }



    parseInt(value): number {
        return parseInt(value, 10);
    }



}
