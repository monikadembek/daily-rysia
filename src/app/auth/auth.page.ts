import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonText,
  IonInputPasswordToggle,
  IonButton,
  IonButtons,
  IonBackButton,
  AlertController,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonImg,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';
import { User } from '../core/models/user.model';

const importsList = [
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  CommonModule,
  ReactiveFormsModule,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonText,
  IonInputPasswordToggle,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonImg,
];

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: importsList,
})
export class AuthPage implements OnInit {
  isLogin = true;
  isRequestInProgress = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(256)]],
    });
  }

  toggleLoginState() {
    this.isLogin = !this.isLogin;
    this.toggleUsernameField();
  }

  private toggleUsernameField(): void {
    if (!this.isLogin) {
      const usernameControl = new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(256),
      ]);
      this.form.addControl('username', usernameControl);
    }
  }

  private async presentAlert(errorMessage: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error occured',
      message: errorMessage,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async onSubmit() {
    try {
      let user: User;
      if (this.isLogin) {
        this.isRequestInProgress = true;
        user = await this.authService.login(this.form.value.email, this.form.value.password);
      } else {
        user = await this.authService.signUp(
          this.form.value.username,
          this.form.value.email,
          this.form.value.password,
        );
      }

      if (user) {
        this.form.reset();
        this.isRequestInProgress = false;
        this.router.navigate(['/tabs/home']);
      }
    } catch (error: any) {
      this.isRequestInProgress = false;
      console.error(error.message);
      await this.presentAlert(error.message);
    }
  }
}
