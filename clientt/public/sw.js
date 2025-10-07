/* Service Worker for FullstackCart
   Handles push events from the server and receives messages from the page
   to display immediate notifications when order status changes.
*/

'use strict';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { title: 'Notification', body: 'You have a new message', url: '/' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error('Error parsing push event data', e);
  }

  const options = {
    body: data.body,
    data: { url: data.url },
    badge: '/favicon.ico',
    icon: '/favicon.ico',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
  // Also notify any open clients so the SPA can react in real-time
  try {
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
        for (const client of clients) {
          try {
            client.postMessage({ type: data.title || 'ORDER_STATUS_UPDATE', ...data });
          } catch (e) {
            // ignore
          }
        }
      })
    );
  } catch (e) {
    console.warn('Failed to postMessage to clients', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url =
    event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Listen for messages from the page to show immediate notifications
self.addEventListener('message', (event) => {
  try {
    const msg = event.data;
    if (!msg) return;
    if (msg.type === 'SHOW_NOTIFICATION') {
      const { title, options } = msg.payload || {};
      self.registration.showNotification(title, options || {});
    }
  } catch (e) {
    console.error('SW message handler error', e);
  }
});
