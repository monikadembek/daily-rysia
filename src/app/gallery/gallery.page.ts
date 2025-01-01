import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonImg,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { Photo } from '../core/models/photo.model';
import { PhotosService } from '../core/services/photos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TopToolbarComponent } from '../shared/top-toolbar/top-toolbar.component';

const importsList = [
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonHeader,
  IonCard,
  IonImg,
  TopToolbarComponent,
  CommonModule,
  FormsModule,
];

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  imports: importsList,
})
export class GalleryPage implements OnInit, ViewWillEnter {
  pageTitle = 'Gallery';
  photos = signal<Photo[]>([]);
  destroyRef = inject(DestroyRef);
  // TODO: implement virtual scrolling here

  constructor(
    private photosService: PhotosService,
    private router: Router,
  ) {}

  ngOnInit() {}

  ionViewWillEnter(): void {
    this.getPhotos();
  }

  getPhotos(): void {
    this.photosService
      .getPhotos()
      .then((photos) => {
        console.log('photos from firestore: ', photos);
      })
      .catch((error) => console.log(error));

    this.photosService.photos$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((photos: Photo[]) => {
        console.log('photos from subject');
        this.photos.set(photos);
      });
  }

  navigateToPhoto(photoId: string): void {
    this.router.navigate(['tabs', 'gallery', 'photo', photoId]);
  }
}
