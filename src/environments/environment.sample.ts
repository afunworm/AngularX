// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  angularx: {
    /*
     *-------------------------------------------------------
     * cloudFunctionsEndpoint <string>
     *-------------------------------------------------------
     * Endpoint for AngularX Cloud Function
     * Example: https://us-central1-project.cloudfunctions.net
     */
    cloudFunctionsEndpoint: '',

    /*
     *-------------------------------------------------------
     * authStatePersistence <string>
     * 'LOCAL' | 'SESSION' | 'NONE'
     *-------------------------------------------------------
     * https://firebase.google.com/docs/auth/web/auth-state-persistence#supported_types_of_auth_state_persistence
     */
    authStatePersistence: 'LOCAL',
    
    login: {
      /*
       *-------------------------------------------------------
       * firebaseUI <boolean>
       *-------------------------------------------------------
       * Use firebaseui or custom log in
       * If custom login, please modify the app/login component
       */
      firebaseUI: true,

      /*
       *-------------------------------------------------------
       * firebaseUIProviders {}
       *-------------------------------------------------------
       * Enable/Disable providers for firebaseUI
       * firebaseUI must be set to true to use this
       */
      firebaseUIProviders: {
        'GoogleAuthProvider': false,
        'FacebookAuthProvider': false,
        'TwitterAuthProvider': false,
        'GithubAuthProvider': false,
        'EmailAuthProvider': true,
        'PhoneAuthProvider': true,
        'AnonymousAuthProvider': false
      }
    }
  },
  /*
   *-------------------------------------------------------
   * firebase config {}
   *-------------------------------------------------------
   * Web app's Firebase configuration
   * Can be found under Project Settings from Firebase console
   */
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.