import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-photos-manager',
  templateUrl: './photos-manager.page.html',
  styleUrls: ['./photos-manager.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonImg, CommonModule, ReactiveFormsModule],
})
export class PhotosManagerPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
