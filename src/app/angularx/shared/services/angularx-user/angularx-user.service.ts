import { Injectable } from "@angular/core";
import { AngularXHTTPService, JSONObject } from '../angularx-http/angularx-http.service';
import { tap, map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { merge as _merge } from 'lodash';
import { forEach as _forEach } from 'lodash';
import { FirebaseCoreService } from '../firebase/firebase-core.service';

export interface UserAuthDataInterface {
    uid: string,
    email: string,
    emailVerified: string,
    displayName: string,
    photoURL: string,
    phoneNumber: string,
    disabled: boolean,
    metadata: {
        lastSignInTime: string,
        creationTime: string
    }
}

export interface UserDataDataInterface {
    photoURL: string,
    lastName: string,
    firstName: string,
    displayName: string,
    phoneNumber: string,
    email: string,
    [name: string]: string
}

export interface UserDataInterface {
    uid: string,
    email: string,
    emailVerified: string,
    displayName: string,
    photoURL: string,
    phoneNumber: string,
    disabled: boolean,
    metadata: {
        lastSignInTime: string,
        creationTime: string
    },
    dob?: null | string | any,
    firstName?: string,
    lastName?: string,
    [name: string]: string | {}
}

export interface UsersDataInterface {
    [name: string]: UserDataInterface
}

export interface UserCustomDataUpdate {
    key: string,
    value: any,
    type: 'boolean' | 'null' | 'string' | 'number' | 'timestamp' | 'delete'
}

@Injectable({ providedIn: 'root' })
export class AngularXUserService {
    
    private _users: UsersDataInterface = {};
    private _gotUsers: boolean = false;
    private _currentUserId: null | string = null;

    constructor(private _http: AngularXHTTPService, private _firebaseCore: FirebaseCoreService) {
    }

    getCurrentUserId() {
        return this._currentUserId;
    }

    getCurrentUser() {

        //Current user is set
        if (this._currentUserId !== null) return this.getUser(this._currentUserId);
        
        //Current is not set, check if the user is logged in
        let firebase = this._firebaseCore.getFirebaseInstance();
        let firebaseCurrentUser = firebase.auth().currentUser;

        //Cannot load the current user if the user isn't logged in
        if (!firebaseCurrentUser) return;

        let uid = firebaseCurrentUser.uid;
        return this.getUser(uid, true, true); //Let getUser() know that this is the current user

    }

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    processUserInitData(data) {
        if (data.error || !data.data) {
            console.log('Error occured: ', data.error);
            return;
        }

        data = data.data;

        //Loop through user list
        for (let i = 0; i < data.length; i++) {

            let currentUser = data[i];
            let uid: string = currentUser.uid;
            this._users[uid] = {
                uid: uid,
                displayName: currentUser.displayName ? currentUser.displayName : '',
                email: currentUser.email ? currentUser.email : '',
                emailVerified: currentUser.emailVerified,
                disabled: currentUser.disabled,
                phoneNumber: currentUser.phoneNumber ? currentUser.phoneNumber : '',
                photoURL: currentUser.photoURL ? currentUser.photoURL : 'assets/images/default_profile.jpg',
                metadata: {
                    creationTime: currentUser.metadata.creationTime,
                    lastSignInTime: currentUser.metadata.lastSignInTime ? currentUser.metadata.lastSignInTime : ''
                }
            };

        }
    }

    getFields(type: 'standard' | 'extra' = 'standard', includeNonUI: boolean = false) {
        //Standard: firstName, lastName, displayName, email, phoneNumber, photoURL, dob, uid
        //Extra: metadata, disabled, emailVerified, providerData, tokensValidAfterTime
        //The rest is custom
        
        if (type === 'standard') {
            if (includeNonUI) return ['firstName', 'lastName', 'displayName', 'email', 'phoneNumber', 'photoURL', 'dob', 'uid'];
            else return ['firstName', 'lastName', 'displayName', 'email', 'phoneNumber', 'photoURL', 'dob'];
        }

        if (type ==='extra') {
            if (includeNonUI) return ['metadata', 'disabled', 'emailVerified', 'providerData', 'tokensValidAfterTime', 'permissions'];
            else return ['metadata'];
        }

        return [];

    }

    isCustomField(fieldName: string) {
        let standardFields = this.getFields('standard', true);
        let extraFields = this.getFields('extra', true);
        return (!standardFields.includes(fieldName) && !extraFields.includes(fieldName));
    }

    handleError(errorResponse) {
        let error = errorResponse.error;
        if (typeof error === 'string') return throwError(error);
        else if (typeof error === 'object') {
            if ('error' in error) return throwError(error.error);
            else return throwError(error);
        }
    }

    getUsers(forceRefresh: boolean = false) {
        if (this._gotUsers) {
            //Already fetched
            if (!forceRefresh) {
                return of(this._users);
            }
        }

        this._gotUsers = true;
        return this._http.get(this._http.getAPIEndpoint('/users')).pipe(
            catchError(error => this.handleError(error)),
            tap((data) => {
                this.processUserInitData(data);
            }),
            map((data) => {
                return this._users;
            })
        );
    }

    getUser(uid: string, forceRefresh: boolean = false, isCurrentUser: boolean = false) {
        //When a user is retrieved using this method, extra fields from Firestore will appear
        //Such as firstName, lastName, dob, etc.
        if (this._users[uid]?.firstName) {
            //Already fetched
            if (!forceRefresh) {
                return of(this._users[uid]);
            }
        }

        return this._http.get(this._http.getAPIEndpoint('/user/' + uid)).pipe(
            catchError(error => this.handleError(error)),
            tap(responseData => {
                //responseData must contain authData &data
                let data = (responseData as any).data;
                let authData = (responseData as any).authData;

                if (this._users[uid] !== undefined) {
                    //Conver date
                    _forEach(data, (value, key) => {
                        if (value !== null && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
                            data[key] = (new Timestamp(value._seconds, value._nanoseconds)).toDate();
                        }
                    });

                    //Cache user's info
                    this._users[uid] = _merge(this._users[uid], data);
                    this._users[uid] = _merge(this._users[uid], authData);
                } else {
                    //Conver date
                    _forEach(data, (value, key) => {
                        if (value !== null && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
                            data[key] = (new Timestamp(value._seconds, value._nanoseconds)).toDate();
                        }
                    });

                    this._users[uid] = data;
                    this._users[uid] = _merge(this._users[uid], authData);
                }
            }),
            map(() => {
                if (isCurrentUser) this._currentUserId = uid;
                return this._users[uid];
            })
        );
    }

    updateUser(uid: string, data: JSONObject) {
        return this._http.patch(this._http.getAPIEndpoint('/user/' + uid), data).pipe(
            catchError(error => this.handleError(error)),
            tap(responseData => {
                if ((responseData as any).data !== undefined) {
                    //Operation succeeded, update cache
                    this._users[uid] = _merge(this._users[uid], data);
                }
            }),
            map(() => {
                return this._users[uid];
            })
        );
    }

    updateUserCustomData(uid: string, data: UserCustomDataUpdate[]) {
        return this._http.patch(this._http.getAPIEndpoint('/user/' + uid + '/custom'), {data: data}).pipe(
            map((data) => {
                if ('error' in data)
                    throw new Error((data as any).error);

                return data;
            }),
            tap(responseData => {
                if ((responseData as any).data !== undefined) {
                    //Operation succeeded, update cache
                    data.forEach(field => {
                        if  (field.type === 'delete') {
                            delete this._users[uid][field.key];
                        } else {
                            this._users[uid][field.key] = field.value;
                        }
                    });
                }
            }),
            map(() => {
                return this._users[uid];
            })
        );
    }

    createUser(data: JSONObject) {
        if (!data.email && !data.phoneNumber) {
            throw new Error('Either email or phone number is required to create a new user.');
            return;
        }

        return this._http.post(this._http.getAPIEndpoint('/user/'), data).pipe(
            catchError(error => this.handleError(error)),
            tap(responseData => {
                if ((responseData as any).data !== undefined && (responseData as any).data.uid) {
                    //Operation succeeded, update cache
                    let uid = (responseData as any).data.uid;
                    this._users[uid] = (responseData as any).data;
                    this._users[uid] = _merge(this._users[uid], data);
                }
            })
        );
    }

}