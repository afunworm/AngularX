import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { FirebaseCoreService } from '../firebase/firebase-core.service';
import { from } from 'rxjs';

@Injectable()
export class AngularXInterceptorService implements HttpInterceptor {

   constructor(private _firebaseCore: FirebaseCoreService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        let firebase = this._firebaseCore.getFirebaseInstance();

        if (!firebase.auth().currentUser) next.handle(request);

        return from(firebase.auth().currentUser.getIdToken()).pipe(
            switchMap(token => {
                const newRequest = request.clone({
                    headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
                });
                return next.handle(newRequest);
            })
        );

    }

}