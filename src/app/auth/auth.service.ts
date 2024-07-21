import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {} // Inject Router

  signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider).then(result => {
      this.router.navigate(['/dashboard']); // Redirect to dashboard after login
      return result;
    });
  }

  signOut(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']); // Redirect to login after logout
    });
  }
}


