import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  IdTokenResult,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { Firestore, addDoc, DocumentReference, collection, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { User } from '../core/models/user.model';
import { USER_STORAGE_KEY } from '../core/constants';
import { UserProfile } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: Auth = inject(Auth);
  firestore = inject(Firestore);

  private _userSubject = new BehaviorSubject<User | null>(null);
  user$ = this._userSubject.asObservable();

  constructor() {}

  // TODO: store data in firebase users collection

  get isUserAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map((user: User | null) => {
        if (!user || !user.accessToken) {
          return false;
        }

        if (!user.expirationTime) {
          return false;
        }

        const isTokenValid = new Date() <= new Date(user.expirationTime);
        return isTokenValid;
      }),
    );
  }

  async signUp(username: string, email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const tokenData: IdTokenResult = await userCredential.user.getIdTokenResult();
      const user = await this.storeUserData(email, userCredential, tokenData);
      this.addUserProfile(username, email, userCredential);
      return user;
    } catch (error: any) {
      console.log('error: ', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email is already registered');
        case 'auth/invalid-email':
          throw new Error('Invalid email format');
        case 'auth/weak-password':
          throw new Error('Password should be at least 6 characters');
        default:
          throw new Error('Failed to create account');
      }
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const tokenData: IdTokenResult = await userCredential.user.getIdTokenResult();
      const user = await this.storeUserData(email, userCredential, tokenData);
      return user;
    } catch (error: any) {
      console.log('error: ', error);
      switch (error.code) {
        case 'auth/email-not-found':
          throw new Error('No email was found');
        case 'auth/invalid-password':
          throw new Error('Invalid password was provided');
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password was provided');
        case 'auth/user-disabled':
          throw new Error('User was disabled');
        default:
          throw new Error('Failed to log in');
      }
    }
  }

  private async storeUserData(
    email: string,
    userCredential: UserCredential,
    tokenData: IdTokenResult,
  ): Promise<User> {
    // console.log('user, ', userCredential);
    // console.log('idTokenResult: ', tokenData);
    const user: User = {
      userId: userCredential.user.uid,
      email: email,
      accessToken: tokenData.token,
      refreshToken: userCredential.user.refreshToken,
      expirationTime: tokenData.expirationTime,
    };
    this._userSubject.next(user);
    await this.persistUser(user);
    console.log('emitted user', user);
    return user;
  }

  async autoLogin() {
    const storageUser = await Preferences.get({ key: USER_STORAGE_KEY });
    let user: User;
    if (storageUser && storageUser.value) {
      user = JSON.parse(storageUser.value);
      console.log('user from storage: ', user);
      this._userSubject.next(user);
    }
  }

  async logout(): Promise<void> {
    this._userSubject.next(null);
    await this.clearUserFromStorage();
  }

  private async persistUser(user: User): Promise<void> {
    await Preferences.set({
      key: USER_STORAGE_KEY,
      value: JSON.stringify(user),
    });
  }

  private async clearUserFromStorage(): Promise<void> {
    await Preferences.remove({ key: USER_STORAGE_KEY });
  }

  addUserProfile(username: string, email: string, userCredential: UserCredential) {
    const newUserProfile: Omit<UserProfile, 'id'> = {
      userId: userCredential.user.uid,
      username: username,
      email: email,
      avatarUrl: userCredential.user.photoURL,
      joinedAt: userCredential.user.metadata.creationTime,
    };

    console.log('userProfile: ', newUserProfile);

    const userProfilesCollection = collection(this.firestore, 'user-profiles');

    addDoc(userProfilesCollection, newUserProfile)
      .then((documentReference: DocumentReference) => {
        // the documentReference provides access to the newly created document
        console.log('user added to user-profiles collection, doc reference', documentReference);
      })
      .catch((error) => console.group(error));
  }

  async getUserProfiles() {
    const userProfilesCollection = collection(this.firestore, 'user-profiles');
    const querySnapshot = await getDocs(userProfilesCollection);
    querySnapshot.forEach((doc) => {
      console.log('user profiles docs: ', doc.id, doc.data());
    });
  }
}
