import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSegmentView,
  IonSegmentContent,
} from '@ionic/angular/standalone';
import { AddPhotoComponent } from './add-photo/add-photo.component';
import { TopToolbarComponent } from '../shared/top-toolbar/top-toolbar.component';

@Component({
  selector: 'app-photos-manager',
  templateUrl: './photos-manager.page.html',
  styleUrls: ['./photos-manager.page.scss'],
  standalone: true,
  imports: [
    IonSegmentButton,
    IonSegment,
    IonContent,
    IonHeader,
    IonLabel,
    IonSegmentView,
    IonSegmentContent,
    AddPhotoComponent,
    TopToolbarComponent,
  ],
})
export class PhotosManagerPage implements OnInit {
  pageTitle = 'Photo Manager';

  constructor() {}

  ngOnInit() {}
}
