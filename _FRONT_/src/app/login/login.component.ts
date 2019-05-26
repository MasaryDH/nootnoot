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

  POST_SERVER_URL = "http://localhost/nootnoot/loginuser"

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { 
    if(this.authService.isAuthenticated() == true){
      this.router.navigate(['/chat']);
    };
  }
    // ----- POST -----
    onSubmitLogin(login){
      // Post Call
      this.http.post(this.POST_SERVER_URL, login)
      .subscribe((status)=> {
        //console.log(JSON.stringify(status));

         // Check if a person exists or not
        if (status == true){
          this.login(login);
          //alert ("Aangemeld")
          this.router.navigate(['/chat'])
          // let myContainerForm = <HTMLFormElement> document.getElementById('loginform');
          // myContainerForm.reset();
        }else{
          alert ("Gebruiker niet gevonden")
        }
      });
  }

  //check if token is created
  login(login) {
    this.authService.login(login);
  }
}

