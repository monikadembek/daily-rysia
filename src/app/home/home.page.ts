import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
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
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { PhotosService } from '../core/services/photos.service';
import { Photo } from '../core/models/photo.model';
import { map, Observable, of } from 'rxjs';
import { Firestore, CollectionReference, collection } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
  AsyncPipe,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonButtons,
  IonButton,
  RouterLink,
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
  isUserAuthenticated: Observable<boolean> = of(false);

  private firestore: Firestore = inject(Firestore);
  photos$: Observable<Partial<Photo[]>> = of([]);
  photosCollection!: CollectionReference;

  constructor(
    private photosService: PhotosService,
    private authService: AuthService,
  ) {
    this.photosCollection = collection(this.firestore, 'photos');
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated;
    this.getHomePagePhoto();
  }

  async logout() {
    await this.authService.logout();
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
