/*
 *-------------------------------------------------------
 * USAGE
 *-------------------------------------------------------
 *
 *  [1] Allows the user to log in using Firebase Auth.
 * 
 *-------------------------------------------------------
 * DETAILS
 *-------------------------------------------------------
 *
 *  [1] logIn(email: string, password: string)
 *      - Log a user in using emaill & password
 *      - A token monitor will be launched upon logging
 *        in successfully
 * 
 */
import { Injectable } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from '@root/src/environments/environment';
import * as firebaseui from 'firebaseui';
import { FirebaseCoreService } from './firebase-core.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private _firebaseUIInitialized = false;

    constructor(
                private _firebaseCore: FirebaseCoreService,
                private _afAuth: AngularFireAuth) {
    }

    /*-------------------------------------------------------*
     * Initialize firebaseui
     *-------------------------------------------------------*/
    initFirebaseUI(selector, uiConfig) {

        //Do not initialize more than once
        if (this._firebaseUIInitialized) return;
        
        // Initialize the FirebaseUI Widget using Firebase.
        let ui = new firebaseui.auth.AuthUI(this._firebaseCore.getFirebaseAuth());
        // The start method will wait until the DOM is loaded.
        ui.start(selector, uiConfig);
        //Note that this has been initialized
        this._firebaseUIInitialized = true;

    }

    /*-------------------------------------------------------*
     * Log a user in with email and password
     *-------------------------------------------------------*/
    logIn(email: string, password: string) {

        // this._afAuth.setPersistence(firebase.auth.Auth.Persistence[environment.angularx.authStatePersistence])
        // .then(() => {
        //     return this._afAuth.signInWithEmailAndPassword(email, password)
        //     .then(data => {
        //         console.log(data);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
        // })
        // .catch(function(error) {
        //     // Handle Errors here.
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        // });

    }

}