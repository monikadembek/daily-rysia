import { inject, Injectable } from '@angular/core';
import { Photo } from '../models/photo.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  collection,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
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
}
