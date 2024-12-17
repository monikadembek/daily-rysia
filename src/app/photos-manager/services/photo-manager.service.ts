import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
import { Firestore, addDoc, collection, getDocs } from '@angular/fire/firestore';
import { Photo } from 'src/app/core/models/photo.model';

export interface CloudinaryUploadResponse {
  imagePublicId: string;
  message: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoManagerService {
  baseUrl = environment.fileUploadApiUrl;

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
  ) {}

  uploadImageToCloudinary(file: File): Observable<CloudinaryUploadResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<CloudinaryUploadResponse>(
      `${this.baseUrl}/files/cloudinary-image-upload`,
      formData,
    );
  }

  storePhotoInFirestore(caption: string, url: string): Observable<any> {
    const newPhoto: Omit<Photo, 'id'> = {
      caption,
      commentsCount: 0,
      createdAt: new Date(),
      likesCount: 0,
      photoUrl: url,
    };
    const photosCollection = collection(this.firestore, 'photos');

    return from(addDoc(photosCollection, newPhoto));
  }

  async getPhotos(): Promise<void> {
    const photosCollection = collection(this.firestore, 'photos');
    const querySnapshot = await getDocs(photosCollection);
    querySnapshot.forEach((doc) => {
      console.log('user profiles docs: ', doc.id, doc.data());
    });
  }
}
