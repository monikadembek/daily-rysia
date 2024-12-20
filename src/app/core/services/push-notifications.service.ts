import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { environment } from '../../../environments/environment';
import { PushTokenManagementService } from './push-token-management.service';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private pushTokenManagmentService: PushTokenManagementService) {}

  async init() {
    if (Capacitor.getPlatform() === 'web') {
      return this.initWebPush();
    } else {
      return this.initNativePush();
    }
  }

  private async initWebPush() {
    try {
      // get messaging instance from existing app
      const messaging = getMessaging();

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: environment.firebaseConfig.vapidKey,
        });
        console.log('FCM Token:', token);

        // Save token to your backend
        await this.saveTokenToBackend(token);

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          this.handleNewMessage(payload);
        });
      }
    } catch (error) {
      console.error('Web push initialization error:', error);
    }
  }

  private async initNativePush() {
    try {
      // Request permission
      const permStatus = await PushNotifications.requestPermissions();
      if (permStatus.receive === 'granted') {
        // Register with Apple / Google to receive push
        await PushNotifications.register();

        // Add listeners for push notifications
        PushNotifications.addListener('registration', async (token) => {
          // Save FCM token to your backend
          await this.saveTokenToBackend(token.value);
          console.log('Push registration success, token:', token.value);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
          this.handleNewMessage(notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          // Handle notification click
          console.log('Notification action performed', action);
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration failed:', error);
        });
      } else {
        console.log('Push notifications permission denied');
      }
    } catch (error) {
      console.error('Native push initialization error:', error);
    }
  }

  private async saveTokenToBackend(token: string) {
    try {
      // Save the token to Firestore
      await this.pushTokenManagmentService.saveToken(token);
    } catch (error) {
      console.error('Error saving token to database:', error);
    }
  }

  private handleNewMessage(payload: any) {
    console.log('New notification received:', payload);
    // Handle the notification based on your app's needs
    // For web, you might want to show a notification
    if (Capacitor.getPlatform() === 'web') {
      new Notification(payload.notification?.title || 'New Notification', {
        body: payload.notification?.body,
      });
    }
  }
}
