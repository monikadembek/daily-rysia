import { Component, OnInit } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonToolbar,
  IonHeader,
  IonInput,
  IonItem,
  IonContent,
  IonImg,
  IonTitle,
  IonButton,
  LoadingController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-claim',
  templateUrl: './auth-claim.component.html',
  styleUrls: ['./auth-claim.component.scss'],
  standalone: true,
  imports: [
    IonToolbar,
    IonHeader,
    IonInput,
    IonItem,
    IonContent,
    IonImg,
    IonTitle,
    IonButton,
    FormsModule,
  ],
})
export class AuthClaimComponent implements OnInit {
  form!: NgForm;
  message = '';
  userId = '';

  constructor(
    private loadingController: LoadingController,
    private functions: Functions,
    private router: Router,
  ) {}

  ngOnInit() {}

  setAdminRole(userId: string): Promise<any> {
    const setAdmin = httpsCallable(this.functions, 'setAdminRole');
    return setAdmin({ uid: userId });
  }

  onSubmit(form: NgForm): void {
    this.message = '';
    let loadingEl: HTMLIonLoadingElement;

    if (form.invalid) {
      this.message = 'Provide valid user id';
      return;
    }

    const userId = form.value.userId;

    if (!userId) {
      this.message = 'Provide valid userId';
      return;
    }

    this.loadingController
      .create({
        keyboardClose: true,
        message: 'Assigning admin permissions...',
      })
      .then((el: HTMLIonLoadingElement) => {
        loadingEl = el;
        loadingEl.present();
        return this.setAdminRole(userId);
      })
      .then((response) => {
        console.log('User was set as admin. ', response.message);
        this.message = 'User was successfully given admin permissions.';
        form.reset();
        loadingEl.dismiss();
      })
      .catch((error) => {
        console.error('Error setting user as admin: ', error.message);
        this.message = 'Error occured when giving admin permissions.';
        loadingEl.dismiss();
      });
  }

  goToHomepage() {
    this.router.navigate(['/tabs/home']);
  }
}
