import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { Photo } from '../core/models/photo.model';
import { PhotosService } from '../core/services/photos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const importsList = [
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonImg,
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
export class GalleryPage implements OnInit {
  photos = signal<Photo[]>([]);
  destroyRef = inject(DestroyRef);
  // TODO: implement virtual scrolling here

  constructor(private photosService: PhotosService) {}

  ngOnInit() {
    this.getPhotos();
  }

  getPhotos(): void {
    this.photosService.photos$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((photos: Photo[]) => {
        this.photos.set(photos);
      });
  }
}
