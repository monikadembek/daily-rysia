/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC61SOUmp386Nxo5ry8TMm9HxOa-nw4LVA',
  authDomain: 'ang-tictactoe.firebaseapp.com',
  projectId: 'ang-tictactoe',
  storageBucket: 'ang-tictactoe.firebasestorage.app',
  messagingSenderId: '680495170100',
  appId: '1:680495170100:web:a2b2bf6b10491c092e4061',
});

// const messaging = firebase.messaging();
let messaging;
try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
}

if (messaging) {
  try {
    // Handle background messages
    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message:', payload);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/icon/favicon.png', // Add your app icon path
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    // Handling Notification click
    self.addEventListener('notificationclick', (event) => {
      event.notification.close(); // CLosing the notification when clicked
      const urlToOpen = event?.notification?.data?.url || 'http://localhost:8100/tabs/gallery';
      // Open the URL in the default browser.
      event.waitUntil(
        clients
          .matchAll({
            type: 'window',
          })
          .then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (const client of windowClients) {
              if (client.url === urlToOpen && 'focus' in client) {
                return client.focus();
              }
            }
            // If not, open a new window/tab with the target URL
            if (clients.openWindow) {
              return clients.openWindow(urlToOpen);
            }
          }),
      );
    });
  } catch (error) {
    console.log('messaging error: ', error);
  }
}
