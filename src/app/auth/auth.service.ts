import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  IdTokenResult,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: Auth = inject(Auth);

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

  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const tokenData: IdTokenResult = await userCredential.user.getIdTokenResult();
      const user = await this.storeUserData(email, userCredential, tokenData);
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
      id: userCredential.user.uid,
      email: email,
      accessToken: tokenData.token,
      refreshToken: userCredential.user.refreshToken,
      expirationTime: tokenData.expirationTime,
    };
    this._userSubject.next(user);
    console.log('emitted user', user);
    return user;
  }

  logout() {
    this._userSubject.next(null);
  }
}
