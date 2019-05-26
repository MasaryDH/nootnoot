import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate() {
    if (this.authService.isAuthenticated()) {
        return true;
    }

    // navigate to login page
    this.router.navigate(['/home']);
    return false;
  }
}
