import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircle, imageOutline, logInOutline, powerOutline } from 'ionicons/icons';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {
    addIcons({ playCircle, imageOutline, logInOutline, powerOutline });
  }

  ngOnInit(): void {
    this.performAutoLogin();
  }

  private async performAutoLogin() {
    await this.authService.autoLogin();
  }
}
