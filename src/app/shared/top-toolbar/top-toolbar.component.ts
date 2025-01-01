import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonTitle,
  IonToolbar,
  IonImg,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  AlertController,
} from '@ionic/angular/standalone';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

const importsList = [
  IonTitle,
  IonToolbar,
  IonImg,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  CommonModule,
  AsyncPipe,
  RouterLink,
];

@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss'],
  standalone: true,
  imports: importsList,
})
export class TopToolbarComponent implements OnInit {
  @Input() pageTitle = '';
  @Input() showBackButton = false;
  @Input() backButtonHref = '';
  isUserAuthenticated$: Observable<boolean> = of(false);

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isUserAuthenticated$ = this.authService.isUserAuthenticated$;
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
}
