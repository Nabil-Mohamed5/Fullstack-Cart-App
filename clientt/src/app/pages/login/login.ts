import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PushService } from '../../services/push.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  userName = '';
  password = '';

  constructor(private auth: AuthService, private router: Router, private push: PushService) { }

  onSubmit() {
    this.auth.login({ userName: this.userName, password: this.password, })
      .subscribe(async () => {
        // Navigate first
        this.router.navigate(['/']);
        // Try to subscribe the user for push notifications (non-blocking)
        try {
          const userId = this.auth.currentUserID();
          await this.push.subscribeAndSendToServer(undefined, undefined, userId);
          console.log('User subscribed for push after login');
        } catch (e) {
          console.warn('Push subscription after login failed', e);
        }
      });
  }
}
