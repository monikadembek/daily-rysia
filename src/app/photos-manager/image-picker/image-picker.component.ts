import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { IonButton, IonLabel, IonIcon, IonImg, Platform } from '@ionic/angular/standalone';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonIcon, IonImg],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef!: ElementRef;
  @Output() imagePicked = new EventEmitter<string | File>();
  @Input() showPreview = true;

  selectedImage: string | File = '';
  showSelectFileBtn = false;

  constructor(private platform: Platform) {}

  ngOnInit() {
    console.log('is mobile: ', this.platform.is('mobile'));
    console.log('is android: ', this.platform.is('android'));
    console.log('is hybrid: ', this.platform.is('hybrid'));
    console.log('is desktop: ', this.platform.is('desktop'));

    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.showSelectFileBtn = true;
    }
  }

  async useCamera() {
    if (!Capacitor.isPluginAvailable('camera')) {
      console.log('camera not available');
      this.showSelectFileBtn = true;
      this.filePickerRef.nativeElement.click();
      return;
    }

    try {
      const image: Photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: true,
        correctOrientation: true,
        saveToGallery: true,
        // webUseInput: true, // to always use file input on desktop, and not the pwa camera
        resultType: CameraResultType.Base64,
      });

      if (image) {
        this.selectedImage = image.base64String as string;
        this.imagePicked.emit(this.selectedImage); // emit base64 to parent
      }
    } catch (error) {
      console.log('Error using camera', error);
      this.filePickerRef.nativeElement.click();
    }
  }

  selectFile(event: Event) {
    console.log('selectFile', event);
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataUrl = fileReader.result?.toString(); // base64 url
      if (dataUrl) {
        this.selectedImage = dataUrl; // show base64 in ion-img
        this.imagePicked.emit(file); // emit file to parent
      }
    };
    fileReader.readAsDataURL(file);
  }
}
