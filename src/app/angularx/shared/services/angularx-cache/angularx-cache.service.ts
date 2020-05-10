import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class AngularXCacheService {

    private _cache = {};

    constructor() {
    }

    set(cacheName: string, cacheData: any, overwrite: boolean = true) {

        if (cacheName in this._cache) {
            if (overwrite) this._cache[cacheName] = cacheData;
            else throw new Error(`Cache name ${cacheName} exists. Use 'overwrite' to overwrite.`);

            return;
        }

        this._cache[cacheName] = cacheData;

    }

    get(cacheName: string) {
        return this._cache[cacheName];
    }

    cacheExists(cacheName: string) {
        return (cacheName in this._cache);
    }

    getFullCache() {
        return this._cache;
    }

}