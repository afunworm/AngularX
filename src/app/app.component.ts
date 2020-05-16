import { Component, OnInit } from '@angular/core';
import { FirebaseCoreService } from './angularx/shared/services/firebase/firebase-core.service';
import { AngularXUserService } from './angularx/shared/services/angularx-user/angularx-user.service';
import { Router, NavigationEnd } from '@angular/router';
import { AngularXDialogService } from './angularx/shared/services/angularx-dialog/angularx-dialog.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'angularx';
    constructor(private _userService: AngularXUserService,
                private _firebaseCore: FirebaseCoreService,
                private _router: Router,
                private _dialogService: AngularXDialogService) {}

    ngOnInit() {

        //Activated whenever a page is loaded
        this._router.events.subscribe($event => {
            if ($event instanceof NavigationEnd) {
                this.initCurrentUser();
            }
        });

    }

    initCurrentUser() {
        this._userService.getCurrentUser().subscribe(currentUser => {
            //Load the current user only if it hasn't been loaded
            if (currentUser !== null) return;

            
            let firebase = this._firebaseCore.getFirebaseInstance();
            let firebaseCurrentUser = firebase.auth().currentUser;

            //Cannot load the current user if the user isn't logged in
            if (!firebaseCurrentUser) return;

            let uid = firebaseCurrentUser.uid;
            this._userService.getUser(uid, true, true).subscribe(
                () => {},
                error => {
                    this._dialogService.alert({
                        title: 'An Error Has Occurred',
                        message: error
                    });
                }
            );
        });
    }
    
}