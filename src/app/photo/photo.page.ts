import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  NavController,
  IonLoading,
} from '@ionic/angular/standalone';
import { TopToolbarComponent } from '../shared/top-toolbar/top-toolbar.component';
import { Photo } from '../core/models/photo.model';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../core/services/photos.service';
import { catchError, EMPTY, finalize, from, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonLoading,
    CommonModule,
    FormsModule,
    TopToolbarComponent,
    DatePipe,
  ],
})
export class PhotoPage implements OnInit {
  pageTitle = 'Daily Rysia';
  photoId: string | null = null;
  photo = signal<Photo | null>(null);
  isLoading = false;
  errorMsg = '';

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private photosService: PhotosService,
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap
      .pipe(
        map((paramMap) => {
          if (!paramMap.has('photoId')) {
            this.navController.navigateBack('tabs/gallery');
            return EMPTY;
          }
          this.photoId = paramMap.get('photoId') as string;
          return this.photoId;
        }),
        switchMap((photoId) => {
          return from(this.photosService.getPhotoById(photoId as string));
        }),
        take(1),
        catchError((error: any) => {
          console.log(error);
          this.errorMsg = 'Photo is currently not available. Please try again later.';
          return EMPTY;
        }),
        map((photo: Photo) => {
          console.log('photo: ', photo);
          this.photo.set(photo);
          return photo;
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe();
  }
}
