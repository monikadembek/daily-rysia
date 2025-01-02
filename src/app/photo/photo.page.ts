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
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { TopToolbarComponent } from '../shared/top-toolbar/top-toolbar.component';
import { Photo } from '../core/models/photo.model';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../core/services/photos.service';
import { catchError, EMPTY, finalize, from, map, of, switchMap, take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../core/models/user.model';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonImg,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardContent,
    IonLoading,
    IonIcon,
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
  heartIcon: 'heart-outline' | 'heart' = 'heart-outline';
  isAlreadyLiked = false;
  showLikeButton = false;
  user: User | null = null;
  likesCount = signal<number>(0);

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private photosService: PhotosService,
    private authService: AuthService,
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
          this.likesCount.set(photo.likesCount);
          return photo;
        }),
        switchMap(() => this.authService.user$),
        switchMap((user) => {
          if (!user) {
            return of(false);
          }
          this.user = user;
          return from(this.photosService.doesUserLikePhoto(this.photoId as string, user.userId));
        }),
        take(1),
        map((wasPhotoLiked) => {
          this.isAlreadyLiked = wasPhotoLiked;
          this.heartIcon = this.isAlreadyLiked ? 'heart' : 'heart-outline';
        }),
        finalize(() => {
          this.isLoading = false;
          this.showLikeButton = !!this.user;
        }),
      )
      .subscribe();
  }

  async toggleLike(): Promise<void> {
    if (this.isAlreadyLiked) {
      await this.photosService.removeLike(this.photoId as string, this.user?.userId as string);
    } else {
      await this.photosService.likePhoto(this.photoId as string, this.user?.userId as string);
    }
    this.isAlreadyLiked = !this.isAlreadyLiked;
    this.heartIcon = this.isAlreadyLiked ? 'heart' : 'heart-outline';
    const likes = await this.photosService.updateLikesNumber(this.photoId as string);
    this.likesCount.set(likes);
  }
}
