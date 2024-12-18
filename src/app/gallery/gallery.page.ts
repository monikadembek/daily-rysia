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
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonIcon,
  AlertController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { Photo } from '../core/models/photo.model';
import { PhotosService } from '../core/services/photos.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, RouterLink } from '@angular/router';

const importsList = [
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonButtons,
  IonButton,
  IonIcon,
  CommonModule,
  FormsModule,
  AsyncPipe,
  RouterLink,
];

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  imports: importsList,
})
export class GalleryPage implements OnInit, ViewWillEnter {
  photos = signal<Photo[]>([]);
  destroyRef = inject(DestroyRef);
  isUserAuthenticated$: Observable<boolean> = of(false);
  // TODO: implement virtual scrolling here

  constructor(
    private photosService: PhotosService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isUserAuthenticated$ = this.authService.isUserAuthenticated$;
  }

  ionViewWillEnter(): void {
    this.getPhotos();
  }

  async logout() {
    await this.authService.logout();
    await this.presentAlert('User has been successfully logged out');
  }

  private async presentAlert(errorMessage: string, header = 'Message'): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: errorMessage,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/tabs/home']);
          },
        },
      ],
    });
    await alert.present();
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
}
