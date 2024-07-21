import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  loginWithGoogle() {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      console.error('Login error:', error);
    });
  }

  logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  }
}
