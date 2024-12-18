// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyC61SOUmp386Nxo5ry8TMm9HxOa-nw4LVA',
    authDomain: 'ang-tictactoe.firebaseapp.com',
    databaseURL: 'https://ang-tictactoe.firebaseio.com',
    projectId: 'ang-tictactoe',
    storageBucket: 'ang-tictactoe.firebasestorage.app',
    messagingSenderId: '680495170100',
    appId: '1:680495170100:web:a2b2bf6b10491c092e4061',
    measurementId: 'G-ZTW4DJ5E8W',
  },
  fileUploadApiUrl: 'http://localhost:3000',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
