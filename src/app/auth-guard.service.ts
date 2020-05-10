import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularXLoadingService } from './angularx/shared/services/angularx-loading/angularx-loading.service';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(private _router: Router, private _afAuth: AngularFireAuth, private _activatedRoute: ActivatedRoute, private _loadingService: AngularXLoadingService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        this._loadingService.show('bar');

        return this._afAuth.authState.pipe(
            take(1),
            map(authState => !!authState),
            map(authenticated => {
                if (!authenticated) {
                    return this._router.createUrlTree(['login'], {relativeTo: this._activatedRoute});
                } else {
                    return true;
                }
            })
        );

    }

    //canActivateChild is the same with canActivate, except it doesn't protect the parent
    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        
        this._loadingService.show('bar');

        return this._afAuth.authState.pipe(
            take(1),
            map(authState => !!authState),
            map(authenticated => {
                if (!authenticated) {
                    return this._router.createUrlTree(['login'], {relativeTo: this._activatedRoute});
                } else {
                    return true;
                }
            })
        );

    }

}