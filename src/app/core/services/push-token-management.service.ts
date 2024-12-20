import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';

export interface TokenDocument {
  token: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  platform: 'web' | 'ios' | 'android';
  isValid: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PushTokenManagementService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  async saveToken(token: string): Promise<void> {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User is logged in:', user);

        const currentUser = this.auth.currentUser;
        console.log(currentUser);
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }

        const tokenDoc: TokenDocument = {
          token: token,
          userId: currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          platform: this.getPlatform(),
          isValid: true,
        };

        // create a unique ID for the token document
        const docId = `${currentUser.uid}_${token}`;

        try {
          // save doc with token to firestore
          await setDoc(doc(this.firestore, 'user_push_tokens', docId), tokenDoc);

          // clean up old tokens for this user
          await this.removeOldTokens(currentUser.uid);
        } catch (error) {
          console.log('error saving token', error);
          throw error;
        }
      } else {
        console.log('No user is logged in');
      }
    });
  }

  private getPlatform(): 'web' | 'ios' | 'android' {
    const platform = Capacitor.getPlatform();
    switch (platform) {
      case 'web':
        return 'web';
      case 'ios':
        return 'ios';
      case 'android':
        return 'android';
      default:
        return 'web';
    }
  }

  private async removeOldTokens(userId: string): Promise<void> {
    const pushTokensCollectionRef = collection(this.firestore, 'user_push_tokens');

    // get all tokens for this user
    const q = query(
      pushTokensCollectionRef,
      where('userId', '==', userId),
      where('isValid', '==', true),
    );

    const querySnapshot = await getDocs(q);
    const tokens = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as TokenDocument),
    }));

    // sort tokens by updatedAt
    tokens.sort((a, b) => {
      const aUpdatedAt =
        a.updatedAt instanceof Timestamp ? a.updatedAt : Timestamp.fromDate(a.updatedAt);
      const bUpdatedAt =
        b.updatedAt instanceof Timestamp ? b.updatedAt : Timestamp.fromDate(b.updatedAt);
      return bUpdatedAt.toMillis() - aUpdatedAt.toMillis();
    });

    // keep only the 3 most recent tokens per platform
    const tokensByPlatform: { [key: string]: typeof tokens } = {
      web: [],
      ios: [],
      android: [],
    };

    tokens.forEach((token) => tokensByPlatform[token.platform].push(token));

    // delete old tokens, keep 3 recent tokens for each platform
    for (const platform in tokensByPlatform) {
      const platformTokens = tokensByPlatform[platform];
      const tokensToDelete = platformTokens.slice(3);

      for (const token of tokensToDelete) {
        await deleteDoc(doc(this.firestore, 'user_push_tokens', token.id));
      }
    }
  }

  async invalidateToken(token: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return;
    }

    const docId = `${currentUser}_${token}`;

    try {
      await setDoc(
        doc(this.firestore, 'user_push_tokens', docId),
        { isValid: false, updatedAt: new Date() },
        { merge: true },
      );
    } catch (error) {
      console.log('Error invalidating token ', error);
      throw error;
    }
  }
}
