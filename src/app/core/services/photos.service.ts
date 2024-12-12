import { Injectable } from '@angular/core';
import { Photo } from '../models/photo.model';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private _photos = new BehaviorSubject<Photo[]>([]);
  photos$: Observable<Photo[]> = this._photos.asObservable();

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

  constructor() {
    this._photos.next(this.samplePhotos);
  }
}
