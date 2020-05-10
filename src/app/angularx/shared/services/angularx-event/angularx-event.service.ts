import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AngularXEventService {

    private _emitters: {
        [name: string]: Subject<any>
    } = {};

    register(name: string) {
        this._emitters[name] = new Subject();
        return this.get(name);
    }

    get(name: string) {
        if (!(name in this._emitters)) throw new Error(`Emitter ${name} does not exist.`);

        return this._emitters[name];
    }

    exists(name: string) {
        return (name in this._emitters);
    }
    
}