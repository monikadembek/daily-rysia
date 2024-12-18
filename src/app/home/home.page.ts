import { Component, OnInit, signal } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
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
  AlertController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { PhotosService } from '../core/services/photos.service';
import { Photo } from '../core/models/photo.model';
import { Observable, of } from 'rxjs';
import { CollectionReference } from '@angular/fire/firestore';
import { Router, RouterLink } from '@angular/router';
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
export class HomePage implements OnInit, ViewWillEnter {
  photo = signal<Photo | null>(null);
  isUserAuthenticated$: Observable<boolean> = of(false);

  photos$: Observable<Partial<Photo[]>> = of([]);
  photosCollection!: CollectionReference;

  constructor(
    private photosService: PhotosService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isUserAuthenticated$ = this.authService.isUserAuthenticated$;
  }

  ionViewWillEnter(): void {
    this.getHomePagePhoto();
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

  getHomePagePhoto(): void {
    console.log('get homepage photo');
    this.photosService
      .getMostRecentPhoto()
      .then((photo) => {
        console.log('homepage photo: ', photo);
        this.photo.set(photo);
      })
      .catch((error) => console.log('error getting most recent photo', error));
  }
}
