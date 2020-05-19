import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ErrorCodesConstants } from '../constants/error-codes-constants';
import { TokenService } from './token.service';
import { DataServiceOptions } from '../models/data-service-options';
import { ConfigurationConstants } from '../constants';
import { ResolveData } from '@angular/router';
import { NotificationService } from './notification-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private baseUrl: string;
    activeTab$ = new Subject<string>();

    constructor(private http: HttpClient,
        private notifier: NotificationService,
        private token: TokenService) {
        this.baseUrl = (window[ 'env' ] && window[ 'env' ][ 'api_url' ]) || 'https://dev-api.buildsupply.io/';
        // this.baseUrl = window[ 'env' ][ 'api_url' ] || 'https://api.yeho.ga';
    }

    private messageSource = new BehaviorSubject("NewLeads");
    currentMessage = this.messageSource.asObservable();

    changeMessage(message: string) {
        this.messageSource.next(message)
    }

    private submitQouteMessage = new BehaviorSubject("NOTSUBMITTED");
    submitQuoteMsg = this.submitQouteMessage.asObservable();

    changeSubmitQuoteMessage(message: string) {
        this.submitQouteMessage.next(message)
    }

    private seachLeads = new BehaviorSubject('');
    searchLeads = this.seachLeads.asObservable();

    searchAllLeads(message: any) {
        this.seachLeads.next(message)
    }


    getRequest(url: string, params: HttpParams = new HttpParams(), reqOptions: DataServiceOptions = null): ResolveData {

        let headers = new HttpHeaders();

        // headers = headers.append('Access-Control-Allow-Origin', '*');
        // headers = headers.append('accept', '*/*');

        if (reqOptions) {
            if (reqOptions.skipLoader) {
                headers = headers.append(ConfigurationConstants.HEADER_SKIP_LOADER, '1');
            }
            if (reqOptions.cache) {
                headers = headers.append(ConfigurationConstants.HEADER_CACHE_REQUEST, '1');
            }
        }

        const requestUrl = (reqOptions && reqOptions.requestURL) ? reqOptions.requestURL : this.baseUrl;
        const options = { params, headers };
        return this.http.get(requestUrl + url, options).toPromise().then(res => res, err => this.handleError(err, ((reqOptions) && (reqOptions.skipLoader === true))))

    }



    sendPostRequest(url: string, params: any, reqOptions: DataServiceOptions = null): Promise<any> {
        let headers = new HttpHeaders();

        if (reqOptions) {
            if (reqOptions.skipLoader) {
                headers = headers.append(ConfigurationConstants.HEADER_SKIP_LOADER, '1');
            }
            if (reqOptions.cache) {
                headers = headers.append(ConfigurationConstants.HEADER_CACHE_REQUEST, '1');
            }

            if (reqOptions.headers) {
                const hdrs = reqOptions.headers.split(',');

                headers = headers.append(hdrs[ 0 ], hdrs[ 1 ]);
            }
        }

        const requestUrl = (reqOptions && reqOptions.requestURL) ? reqOptions.requestURL : this.baseUrl;
        const options = { headers }


        return this.http
            .post(requestUrl + url, params, options)
            .toPromise()
            .then(res => res as any, err => this.handleError(err, ((reqOptions) && (reqOptions.skipLoader === true))));
    }



    sendPutRequest(url: string, params: any, reqOptions: DataServiceOptions = null): Promise<any> {
        let headers = new HttpHeaders();
        if (reqOptions) {
            if (reqOptions.skipLoader) {
                headers = headers.append(ConfigurationConstants.HEADER_SKIP_LOADER, '1');
            }
        }
        const reqURL = (reqOptions && reqOptions.requestURL) ? reqOptions.requestURL : this.baseUrl;
        return this.http
            .put(reqURL + url, params, { headers: headers })
            .toPromise()
            .then(res => res as any, err => this.handleError(err, ((reqOptions) && (reqOptions.skipLoader === true))));
    }

    sendDeleteRequest(url: string, params: any, reqOptions: DataServiceOptions = null): Promise<any> {
        let headers = new HttpHeaders();
        if (reqOptions) {
            if (reqOptions.skipLoader) {
                headers = headers.append(ConfigurationConstants.HEADER_SKIP_LOADER, '1');
            }
        }
        const reqURL = (reqOptions && reqOptions.requestURL) ? reqOptions.requestURL : this.baseUrl;
        return this.http.delete(reqURL + url, { headers: headers, params: params })
            .toPromise()
            .then(res => res as any, err => this.handleError(err, ((reqOptions) && (reqOptions.skipLoader === true))));
    }


    private handleError(err: HttpErrorResponse, skipErrorNotify = false) {

        if ((!window.navigator.onLine) || ((typeof err === 'object') && (err.status === ErrorCodesConstants.ERROR_HTTP_NO_RESPONSE))) {
            this.notifier.clearAllNotifications();
            this.notifier.notify("INTERNET CONNECTION ISSUE");
            throw undefined;
        }

        if (err.error.error === "Unauthorized" && err.error.httpStatusCode === 401) {
            localStorage.clear();
            window.location.reload();
        }

        this.notifier.notify(err.error.message);
        throw err.error;
    }


}
