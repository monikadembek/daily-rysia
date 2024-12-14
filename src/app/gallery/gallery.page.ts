import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
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
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { Photo } from '../core/models/photo.model';
import { PhotosService } from '../core/services/photos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

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
  IonButtons,
  IonButton,
  IonIcon,
  CommonModule,
  FormsModule,
  AsyncPipe,
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
  isUserAuthenticated: Observable<boolean> = of(false);
  // TODO: implement virtual scrolling here

  constructor(
    private photosService: PhotosService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.getPhotos();
    this.isUserAuthenticated = this.authService.isUserAuthenticated;
  }

  logout() {
    this.authService.logout();
  }

  getPhotos(): void {
    this.photosService.photos$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((photos: Photo[]) => {
        this.photos.set(photos);
      });
  }
}
