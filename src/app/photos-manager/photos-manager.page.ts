import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSegmentView,
  IonSegmentContent,
} from '@ionic/angular/standalone';
import { AddPhotoComponent } from './add-photo/add-photo.component';

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
    IonTitle,
    IonToolbar,
    IonImg,
    IonLabel,
    IonSegmentView,
    IonSegmentContent,
    AddPhotoComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class PhotosManagerPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
