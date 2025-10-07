import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { PushService } from './push.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient, private authService: AuthService, private push: PushService) { }

  sendOrder() {

    let orderData = {
      userId: this.authService.currentUserID(),
      products: JSON.parse(localStorage.getItem('cart_items')!),
    };

    console.log(orderData);

    this.http.post('/api/v1.0/orders/store', orderData).subscribe({
      next: (response) => {
        console.log('Order placed successfully', response);
      },
      error: (error) => {
        console.error('Error placing order', error);
      }
    });
  }

  // Notify the current client immediately that an order status has changed
  // This is a client-side immediate notification. For server push, the backend should trigger a push event.
  async notifyStatusChange(orderId: string, newStatus: string) {
    const title = `Order ${orderId} status updated`;
    const body = `Your order is now: ${newStatus}`;
    // Try request permission if not already granted
    try {
      const permission = await this.push.requestPermission();
      if (permission !== 'granted') return;
      // Use service worker notification if registered
      await this.push.register();
      await this.push.showLocalNotification(title, { body, data: { orderId }, tag: `order-${orderId}` });
    } catch (e) {
      console.error('Failed to show status notification', e);
    }
  }
}
