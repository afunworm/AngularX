import { Injectable } from "@angular/core";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { environment } from '../../../../../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

interface FirebaseCore {
    auth: Function | {}
}

@Injectable({ providedIn: 'root' })
export class FirebaseCoreService implements FirebaseCore {

    constructor(private _afAuth: AngularFireAuth) {

        //Initial firebase
        if (firebase.apps.length === 0) {
            firebase.initializeApp(environment.firebase);
        }

        //firebase.auth().setPersistence(firebase.auth.Auth.Persistence[environment.angularx.authStatePersistence])
        _afAuth.setPersistence(firebase.auth.Auth.Persistence[environment.angularx.authStatePersistence]);

        //Assign publicly accessibe variable

    }

    getFirebaseAuth() {
        return firebase.auth();
    }

    getFirebaseInstance() {
        return firebase;
    }

    getFirestoreInstance() {
        return firebase.firestore();
    }

    getStorageInstance() {
        return firebase.storage();
    }

    setPersistence() {
        // return firebase.auth().setPersistence(firebase.auth.Auth.Persistence[environment.angularx.authStatePersistence]);
    }

    public get auth() {
        return firebase.auth;
    }

}