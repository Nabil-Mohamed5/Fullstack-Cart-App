import { Component, signal } from '@angular/core';
import { Navbar } from "./shared/navbar/navbar";
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cart');
  constructor(private authService: AuthService, private push: PushService) {
    // Register the service worker on app start (non-blocking)
    if (typeof window !== 'undefined') {
      this.push.register().catch((e) => console.warn('SW register failed', e));

      // If user is logged in, attempt to subscribe to server push and post subscription
      // Non-blocking: fire-and-forget, log errors
      (async () => {
        try {
          if (this.authService.isLoggedIn()) {
            const userId = this.authService.currentUserID();
            await this.push.subscribeAndSendToServer(undefined, undefined, userId);
            console.log('Subscribed to push and sent subscription to server');
          }
        } catch (err) {
          console.warn('Push subscription failed', err);
        }
      })();
    }
  }
}
