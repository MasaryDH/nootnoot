import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  constructor(private router: Router) { }

    /**
     * check for expiration and if token is still existing
     * @return {boolean}
     */
    isAuthenticated(): boolean {
        return localStorage.getItem('token') != null && !this.isTokenExpired();
    }

    // check if token is valid
    isTokenExpired(): boolean {
        return false;
    }

    //create token on login
    login(user, id) {
        let objToken = { user_email : user, iduser : id }
        console.log(objToken);
        localStorage.setItem('token', JSON.stringify(objToken));
    }

    //clear local storage
    clear() {
        localStorage.clear();
    }

    //on logout clear local storage and redirect to home
    logout() {
        this.clear();
        this.router.navigate(['/home']);
    }
}