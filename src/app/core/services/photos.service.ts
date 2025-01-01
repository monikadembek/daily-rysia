import { inject, Injectable } from '@angular/core';
import { Photo } from '../models/photo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  Timestamp,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private _photos = new BehaviorSubject<Photo[]>([]);
  photos$: Observable<Photo[]> = this._photos.asObservable();

  firestore = inject(Firestore);

  private samplePhotos: Photo[] = [
    {
      id: '1',
      photoUrl:
        'https://res.cloudinary.com/dg57kbwwj/image/upload/v1733945615/rysia-photos/grokzhs4fnrwfdz8mtmo.jpg',
      caption: 'First photo',
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(Date.now()),
    },
    {
      id: '2',
      photoUrl:
        'https://res.cloudinary.com/dg57kbwwj/image/upload/v1733945615/rysia-photos/wwvw7f2zqho0c5j4ngyd.jpg',
      caption: 'Second photo',
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(Date.now()),
    },
    {
      id: '3',
      photoUrl:
        'https://res.cloudinary.com/dg57kbwwj/image/upload/v1733945615/rysia-photos/xi50rkgocjfziifwudf5.jpg',
      caption: 'Third photo',
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(Date.now()),
    },
    {
      id: '4',
      photoUrl:
        'https://res.cloudinary.com/dg57kbwwj/image/upload/v1734032692/wwvw7f2zqho0c5j4ngyd_pxr64p.jpg',
      caption: 'Fourth photo',
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(Date.now()),
    },
  ];

  get photos(): Photo[] {
    return this._photos.value;
  }

  constructor() {}

  async getPhotos(): Promise<Photo[]> {
    const photos: Photo[] = [];

    const photosCollection = collection(this.firestore, 'photos');
    const photosQuery = query(photosCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(photosQuery);

    querySnapshot.forEach((doc) => {
      // console.log('user profiles docs: ', doc.id, doc.data());
      const docData = doc.data() as Omit<Photo, 'id'>;
      const photo = {
        id: doc.id,
        photoUrl: docData.photoUrl,
        caption: docData.caption,
        likesCount: docData.likesCount,
        commentsCount: docData.commentsCount,
        createdAt: (docData.createdAt as unknown as Timestamp).toDate(),
      };
      photos.push(photo);
    });

    this._photos.next(photos);
    return photos;
  }

  async getMostRecentPhoto(): Promise<Photo> {
    const photosCollection = collection(this.firestore, 'photos');
    const lastDocQuery = query(photosCollection, orderBy('createdAt', 'desc'), limit(1));

    const snapshot = await getDocs(lastDocQuery);
    const docData = snapshot.docs[0]?.data() as Omit<Photo, 'id'>;

    const recentPhoto = {
      id: snapshot.docs[0]?.id,
      photoUrl: docData.photoUrl,
      caption: docData.caption,
      likesCount: docData.likesCount,
      commentsCount: docData.commentsCount,
      createdAt: (docData.createdAt as unknown as Timestamp).toDate(),
    };
    return recentPhoto;
  }

  async getPhotoById(id: string): Promise<Photo> {
    const docRef = doc(this.firestore, `photos/${id}`);
    const snapshot = await getDoc(docRef);
    const docData = snapshot.data() as Omit<Photo, 'id'>;
    const photo: Photo = {
      id: docRef.id,
      ...docData,
      createdAt: (docData.createdAt as unknown as Timestamp).toDate(),
    };

    return photo;
  }

  async likePhoto(photoId: string, userId: string): Promise<void> {
    const likeDocRef = doc(this.firestore, `photos/${photoId}/likes/${userId}`);
    await setDoc(likeDocRef, { likedAt: serverTimestamp() });
  }

  async removeLike(photoId: string, userId: string): Promise<void> {
    const likeDocRef = doc(this.firestore, `photos/${photoId}/likes/${userId}`);
    await deleteDoc(likeDocRef);
  }

  async doesUserLikePhoto(photoId: string, userId: string): Promise<boolean> {
    const likeDocRef = doc(this.firestore, `photos/${photoId}/likes/${userId}`);
    const snaphot = await getDoc(likeDocRef);
    return !!snaphot;
  }

  async getLikesCount(photoId: string): Promise<number> {
    const likesCollectionRef = collection(this.firestore, `photos/${photoId}/likes`);
    const likesSnapshot = await getDocs(likesCollectionRef);
    return likesSnapshot.size;
  }

  async updateLikesNumber(photoId: string): Promise<number> {
    const likesCount = await this.getLikesCount(photoId);
    const photoDocRef = doc(this.firestore, `photos/${photoId}`);
    await updateDoc(photoDocRef, { likesCount });
    return likesCount;
  }
}
