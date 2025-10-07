import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PushService {
  private swRegistration?: ServiceWorkerRegistration;

  constructor() { }

  async register(swPath = '/sw.js') {
    if (!('serviceWorker' in navigator)) return null;
    try {
      this.swRegistration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', this.swRegistration);
      return this.swRegistration;
    } catch (err) {
      console.error('Service Worker registration failed:', err);
      return null;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';
    const permission = await Notification.requestPermission();
    return permission;
  }

  async showLocalNotification(title: string, options?: NotificationOptions) {
    // If service worker is available, use it to show the notification so it works when the page is in background
    if (this.swRegistration && this.swRegistration.showNotification) {
      this.swRegistration.showNotification(title, options || {});
      return;
    }

    // Fallback to the Notification API directly
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  // For server push subscriptions (optional helper). Expects vapidPublicKey base64 url-safe string
  async subscribeToPush(vapidPublicKey: string) {
    if (!this.swRegistration) {
      await this.register();
    }
    if (!this.swRegistration || !('pushManager' in this.swRegistration)) {
      throw new Error('Push not supported');
    }
    const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await this.swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    return subscription;
  }

  // Convenience: fetch VAPID public key from backend and POST subscription
  async subscribeAndSendToServer(fetchVapidUrl = '/api/v1.0/push/vapidPublicKey', postSubscribeUrl = '/api/v1.0/push/subscribe', userId?: string) {
    try {
      // Get VAPID key
      console.log('Fetching VAPID public key from', fetchVapidUrl);
      const resp = await fetch(fetchVapidUrl);
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        console.error('Failed to fetch VAPID public key', resp.status, text);
        throw new Error('Failed to fetch VAPID key');
      }
      const json = await resp.json();
      const publicKey = json.publicKey;
      console.log('Received VAPID public key (length):', (publicKey || '').length);

      const subscription = await this.subscribeToPush(publicKey);
      console.log('Obtained push subscription:', subscription);

      // Send subscription to server
      console.log('Posting subscription to server', postSubscribeUrl);
      const postResp = await fetch(postSubscribeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, userId }),
      });
      if (!postResp.ok) {
        const text = await postResp.text().catch(() => '');
        console.error('Failed to register subscription on server', postResp.status, text);
        throw new Error('Failed to register subscription on server');
      }
      console.log('Subscription registered on server');
      return subscription;
    } catch (err) {
      console.error('subscribeAndSendToServer error', err);
      throw err;
    }
  }

  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
