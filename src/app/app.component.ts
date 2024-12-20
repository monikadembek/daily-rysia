import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  playCircle,
  imageOutline,
  logInOutline,
  powerOutline,
  cameraOutline,
  camera,
} from 'ionicons/icons';
import { AuthService } from './auth/auth.service';
import { from } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PushNotificationService } from './core/services/push-notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private pushNotificationService: PushNotificationService,
  ) {
    addIcons({ playCircle, imageOutline, logInOutline, powerOutline, cameraOutline, camera });
    from(this.retrieveUserFromStorage()).pipe(takeUntilDestroyed()).subscribe();
    this.initializePush();
  }

  async ngOnInit(): Promise<void> {
    // register service worker responsible for web push notifications
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: 'firebase-cloud-messaging-push-scope',
        });
        console.log('Firebase Service Worker registered:', registration);

        // Initialize push notifications after SW registration
        await this.pushNotificationService.init();
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async initializePush() {
    await this.pushNotificationService.init();
  }

  private async retrieveUserFromStorage() {
    await this.authService.retrieveUserFromStorage();
  }
}
