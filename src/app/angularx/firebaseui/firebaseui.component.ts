/*
 *-------------------------------------------------------
 * USAGE
 *-------------------------------------------------------
 *
 *  [1] Handling login logic. Can be edited.
 * 
 *-------------------------------------------------------
 * DETAILS
 *-------------------------------------------------------
 *
 *  [1] constructor()
 *          - Contains a subscription that got activated
 *            when the user's auth state is changed.
 *
 *  [2] logIn(email: string, password: string)
 *          - Log a user in after form submission is
 *            invoked. 
 * 
 */

import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../shared/services/firebase/authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirebaseCoreService } from '../shared/services/firebase/firebase-core.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'angularx-firebaseui',
    templateUrl: './firebaseui.component.html',
    styleUrls: ['./firebaseui.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FirebaseUIComponent implements OnInit, OnDestroy, AfterViewInit {

    private _sessionSubscription: Subscription;

    constructor(private _authentication: AuthenticationService,
                private _firebaseCore: FirebaseCoreService,
                private _afAuth: AngularFireAuth,
                private _router: Router) {

    }

    ngOnInit(): void {
        //Navigate user to dashboard if logged in
        this._sessionSubscription = this._afAuth.user.subscribe(user => {
            if (!!user) this._router.navigate(['angularx-admin']);
        });
    }

    ngAfterViewInit() {

        const firebase = this._firebaseCore.getFirebaseInstance();

        let uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    return false;
                    //this._router.navigate(['angularx-admin']);
                }
            },
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
            ],
            // tosUrl and privacyPolicyUrl accept either url string or a callback
            // function.
            // Terms of service url/callback.
            tosUrl: 'https://xcel.digital',
            // Privacy policy url/callback.
            privacyPolicyUrl: function() {
                window.location.assign('https://xcel.digital');
            }
        };

        this._authentication.initFirebaseUI('#firebaseui-auth-container', uiConfig);

    }

    ngOnDestroy() {
        this._sessionSubscription.unsubscribe();
    }

    onSubmit(form: NgForm) {

    }

}
