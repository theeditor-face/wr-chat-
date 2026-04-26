// ═══════════════════════════════════════════
//  firebase-messaging-sw.js
//  Service Worker — Background Notifications
//  Place this file in your ROOT folder
// ═══════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyCL7AkibOvzov_pzjnjuPEiQ4lRjgF5ljo",
  authDomain:        "wholesale-realtors-chat.firebaseapp.com",
  projectId:         "wholesale-realtors-chat",
  storageBucket:     "wholesale-realtors-chat.firebasestorage.app",
  messagingSenderId: "923093540234",
  appId:             "1:923093540234:web:253b7f453e67479363fc73"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Wholesale Realtors Chat', {
    body:  body  || 'You have a new message',
    icon:  icon  || '/icon.png',
    badge: '/icon.png',
    data:  payload.data || {},
    actions: [{ action: 'open', title: 'Open Chat' }]
  });
});

// Click notification → open chat
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const chatCode = e.notification.data?.chatCode;
  const url = chatCode ? `/chat.html?code=${chatCode}` : '/';
  e.waitUntil(clients.openWindow(url));
});
