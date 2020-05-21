import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { TokenService } from './token.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import * as $ from 'jquery';
import { SigninStepper } from '../models/signin-stepper';
import { API } from '../constants';

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
        $('html, body').animate({ scrollTop: 0 }, 500);
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

    smoothScrollToElement({ element, fromStart = true, extraOffset = 220, className }) {

        const timer = setTimeout(() => {
            element = element as HTMLFontElement;
            const errElm = document.querySelector(className);
            window.scrollBy({
                top: -(extraOffset - (errElm.getBoundingClientRect().top)),
                behavior: 'smooth'
            });
            clearTimeout(timer);
        }, 100);

    }

    static closeMiniBag() {
        $('.minibag__wrapper').addClass('hide');
    }


    static addScrollFixPopup() {
        $('.cdk-overlay-container').addClass('popupScrollFix');
    }

    static removeScrollFixPopup() {
        $('.cdk-overlay-container').removeClass('popupScrollFix');
    }


    // it is publishing this value to all the subscribers that have already subscribed to this message
    isHeaderFooterVisible(value: boolean) {
        this.isHeaderVisible.next(value);
    }

    parseInt(value): number {
        return parseInt(value, 10);
    }

    getUniqueId() {
        return this.dataService.getRequest(API.UNIQUE_ID).then(res => res.data);
    }

    docUpload(data) {
        return this.dataService.sendPostRequest(API.UPLOAD_DOC, data).then(res => res);
    }

    docDownload(id: number) {
        return this.dataService.getRequest(API.DOWNLOAD_DOC(id)).then(res => res.data);
    }
}
