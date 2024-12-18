import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
import { Firestore, addDoc, collection, getDocs } from '@angular/fire/firestore';
import { Photo } from '../../core/models/photo.model';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { UPLOAD_FOLDER_NAME } from '../../core/constants';

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
    private functions: Functions,
  ) {}

  uploadImageToCloudinary(file: File): Observable<CloudinaryUploadResponse> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<CloudinaryUploadResponse>(
      `${this.baseUrl}/files/cloudinary-image-upload?folder=${UPLOAD_FOLDER_NAME}`,
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

  // TODO: uploadImage cloud function needs some fix, it uploads file to storage but doesn't show file
  uploadImageCloudFunction(
    fileName: string,
    base64String: string,
    contentType: string = 'image/jpeg',
  ) {
    const uploadImage = httpsCallable(this.functions, 'uploadImage');

    uploadImage({
      fileName,
      contentType,
      base64Data: base64String,
    })
      .then((result: any) => {
        console.log('Upload URL:', result.data.url);
      })
      .catch((error) => console.error(error));
  }

  addOptimizationParameterToImageUrl(url: string): string {
    const newUrl = url.replace('upload/', 'upload/q_auto/');
    return newUrl;
  }
}
