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

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icon/favicon.png', // Add your app icon path
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
