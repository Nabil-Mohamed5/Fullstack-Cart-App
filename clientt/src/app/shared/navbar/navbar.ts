import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(private router: Router, protected cartOutlet: CartService,public authService: AuthService) { }

  cart() {
    this.router.navigate(['cart']);
  }
  home() {
    this.router.navigate(['']);
  }
  login() {
    this.router.navigate(['login']);
  }
  order() {
    this.router.navigate(['order']);
  }
}
