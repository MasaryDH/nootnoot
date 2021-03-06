import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  LOGIN_SERVER_URL = "http://localhost/nootnoot/loginuser";

  //error build
  user_email: string;
  user_password: string;
  iduser;
  

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { 
    //if user is logged in, redirect to chat
    if(this.authService.isAuthenticated() == true){
      this.router.navigate(['/chat']);
    };
  }
    // ----- POST -----
    onSubmitLogin(login){
      // Post Call
      this.http.post(this.LOGIN_SERVER_URL, login)
      .subscribe((status)=> {
        //get iduser from status
        let iduser = status['iduser'];

        // If person exists status = true
        if (status['status'] == true){
          this.login(login.user_email, iduser);
          //redirect to chat if user exists
          this.router.navigate(['/chat'])
        } else {
          alert ("Gebruiker niet gevonden")
        }
      });
  }

  //create token
  login(login, iduser) {
    this.authService.login(login, iduser);
  }
}

