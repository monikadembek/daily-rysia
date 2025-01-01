import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader,
  IonContent,
  IonCol,
  IonGrid,
  IonRow,
  IonImg,
  IonCard,
  IonCardSubtitle,
  IonCardHeader,
  IonCardTitle,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { PhotosService } from '../core/services/photos.service';
import { Photo } from '../core/models/photo.model';
import { Observable, of } from 'rxjs';
import { CollectionReference } from '@angular/fire/firestore';
import { TopToolbarComponent } from '../shared/top-toolbar/top-toolbar.component';

const importsList = [
  IonCardSubtitle,
  IonCard,
  IonImg,
  IonCol,
  IonHeader,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  DatePipe,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  TopToolbarComponent,
];

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: importsList,
})
export class HomePage implements OnInit, ViewWillEnter {
  pageTitle = 'Daily Rysia';
  photo = signal<Photo | null>(null);

  photos$: Observable<Partial<Photo[]>> = of([]);
  photosCollection!: CollectionReference;

  constructor(private photosService: PhotosService) {}

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.getHomePagePhoto();
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
