import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cart } from './shared/cart/cart';
import { authGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';
import { Orders } from './pages/orders/orders';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login },
  { path: 'order', component: Orders, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
