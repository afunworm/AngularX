import { Injectable } from "@angular/core";
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@root/src/environments/environment';

interface RequestOptions {
    headers?: { [name: string]: string; },
    params?: { [name: string]: string; },
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text'
}

export interface JSONObject {
    [name: string]: string | any
}

@Injectable({ providedIn: 'root' })
export class AngularXHTTPService {

    private _angularXEndpoint: string = environment.angularx.cloudFunctionsEndpoint;

    constructor(private _http: HttpClient) {
    }

    getAPIEndpoint(route = '') {
        route = route.replace(/\/$/, '');
        this._angularXEndpoint = this._angularXEndpoint.replace(/^\//, '');

        return this._angularXEndpoint + '/' + route;
    }

    extend(defaults: object, options: object) {
        return Object.assign(defaults, options);
    }

    buildParams(queryObject: JSONObject) {
        let httpParams = new HttpParams();
        let counter = 0;

        for (let key in queryObject) {
            let value = queryObject[key];
            
            if (counter === 0) httpParams.set(key, value);
            else httpParams.append(key, value);

            counter++;
        }
        
        return httpParams;
    }

    buildHeaders(headerObject: JSONObject) {
        return new HttpHeaders(headerObject);
    }
    
    buildHttpOptions(options: RequestOptions) {

        let httpOptions: any = {};

        options.params = options.params ? options.params : {};
        options.headers = options.headers ? options.headers : {};

        //Build query parameters
        if (Object.keys(options.params).length > 0) {
            httpOptions.params = this.buildParams(options.params);
        }

        //Build header parameters
        if (Object.keys(options.headers).length > 0) {
            httpOptions.headers = this.buildHeaders(options.headers);
        }

        return httpOptions;

    }

    get(url: string, options: RequestOptions = {}) {

        //Configuring defaults
        let defaults = {
            responseType: 'json'
        };
        
        options = this.extend(defaults, options);

        return this._http.get(url, this.buildHttpOptions(options));

    }

    post(url: string, data: JSONObject, options: RequestOptions = {}) {

        //Configuring defaults
        let defaults = {
            responseType: 'json'
        };
        
        options = this.extend(defaults, options);

        return this._http.post(url, data, this.buildHttpOptions(options));

    }

    put(url: string, data: JSONObject, options: RequestOptions = {}) {

        //Configuring defaults
        let defaults = {
            responseType: 'json'
        };
        
        options = this.extend(defaults, options);

        return this._http.put(url, data, this.buildHttpOptions(options));

    }

    patch(url: string, data: JSONObject, options: RequestOptions = {}) {

        //Configuring defaults
        let defaults = {
            responseType: 'json'
        };
        
        options = this.extend(defaults, options);

        return this._http.patch(url, data, this.buildHttpOptions(options));

    }

    delete(url: string, options: RequestOptions = {}) {

        //Configuring defaults
        let defaults = {
            responseType: 'json'
        };
        
        options = this.extend(defaults, options);

        return this._http.delete(url, this.buildHttpOptions(options));

    }

}