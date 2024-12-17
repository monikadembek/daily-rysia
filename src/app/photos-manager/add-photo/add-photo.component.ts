import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonGrid, IonRow, IonCol, IonInput, IonItem, IonButton } from '@ionic/angular/standalone';
import { ImagePickerComponent } from '../image-picker/image-picker.component';
import { UtilsService } from '../services/utils.service';
import { CloudinaryUploadResponse, PhotoManagerService } from '../services/photo-manager.service';
import { switchMap } from 'rxjs';
import { DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonItem,
    IonButton,
    ImagePickerComponent,
  ],
})
export class AddPhotoComponent implements OnInit {
  form: FormGroup = this.fb.group({
    caption: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(256)]],
    photoFile: ['', [Validators.required]],
  });
  imageFile: File | null = null;
  showPreview = true;

  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private photoManagerService: PhotoManagerService,
  ) {}

  ngOnInit() {}

  onImagePicked(imageData: string | File) {
    console.log(imageData);
    if (typeof imageData === 'string') {
      //base64 data
      this.imageFile = this.utilsService.base64ToFile(imageData, 'image.jpg');
      console.log(this.imageFile);
    } else {
      this.imageFile = imageData;
    }
    this.form.patchValue({ photoFile: this.imageFile });
  }

  // TODO:
  // 1. handle errors from upload and push to firestore
  // 2. add loaders and possible alers or error messages
  submitForm() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form);
    this.photoManagerService
      .uploadImageToCloudinary(this.imageFile!)
      .pipe(
        switchMap((res: CloudinaryUploadResponse) => {
          console.log('upload image res: ', res);
          return this.photoManagerService.storePhotoInFirestore(this.form.value.caption, res.url);
        }),
      )
      .subscribe((doc: DocumentReference) => {
        console.log('photo added to photos collection, doc reference', doc);
        console.log(
          'id: ',
          doc.id,
          ', path (collection/docId):',
          doc.path,
          ', parent collection ref: ',
          doc.parent,
        );
        if (doc) {
          this.form.reset();
          this.imageFile = null;
          this.showPreview = false;
        }
      });
  }
}
