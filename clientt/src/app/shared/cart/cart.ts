import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

  constructor(protected cart:CartService, private router: Router) {}

  remove(id: string) {
    this.cart.removeItem(id);
  }

  checkout() {
    this.router.navigate(['/order']);
  }
}
