import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
  today = new Date();
  orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

  constructor(protected cart: CartService, private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.sendOrder();

    // Listen for service worker messages about order status updates and show in-app notification
    try {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (ev: any) => {
          try {
            const msg = ev.data;
            if (!msg) return;
            // expecting payload like { type: 'ORDER_STATUS_UPDATE', orderId, status }
            if (msg.type === 'ORDER_STATUS_UPDATE' || (msg.type === 'Order status updated')) {
              const orderId = msg.orderId || msg.payload?.orderId || msg.payload?.data?.orderId;
              const status = msg.status || msg.payload?.status || msg.payload?.data?.status;
              if (orderId && status) {
                // show immediate client-side notification
                this.orderService.notifyStatusChange(orderId.toString(), status.toString());
              }
            }
          } catch (e) {
            console.warn('Failed to handle SW message', e);
          }
        });
      }
    } catch (e) {
      console.warn('Service worker message binding failed', e);
    }
  }

  ngOnDestroy() {
    this.cart.clearCart();
  }
}
