import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonImg,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { PhotosService } from '../core/services/photos.service';
import { Photo } from '../core/models/photo.model';
import { map } from 'rxjs';

const importsList = [
  IonCardSubtitle,
  IonCard,
  IonImg,
  IonCol,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  DatePipe,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
];

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: importsList,
})
export class HomePage implements OnInit {
  photo = signal<Photo | null>(null);
  destroyRef = inject(DestroyRef);

  constructor(private photosService: PhotosService) {}

  ngOnInit(): void {
    this.getHomePagePhoto();
  }

  getHomePagePhoto(): void {
    this.photosService.photos$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((photos) => photos[0]),
      )
      .subscribe((photo: Photo) => {
        this.photo.set(photo);
      });
  }
}
