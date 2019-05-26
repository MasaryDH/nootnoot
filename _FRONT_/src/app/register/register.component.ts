import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  POST_SERVER_URL = "http://localhost/nootnoot/users";

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  // ----- POST -----
  onSubmit(person){
    // Add values admin_idadminRights + status_idstatus
    person.admin_idadminRights = '0';
    person.status_idstatus = '1';

    // Check if password matches
    if (person.user_password == person.user_passwordCheck){
      // post call + responseType = give response as text
      this.http.post(this.POST_SERVER_URL, person, {responseType: 'text'})
      .subscribe((status)=> {
        //console.log(JSON.stringify(status));
        alert("Registratie Gelukt, Welkom "+person.user_firstname+" "+person.user_lastname+"");

        //create token, login user & redirect to chat
        this.login(person);
        this.router.navigate(['/chat'])

        //empty form
        let myContainerForm = <HTMLFormElement> document.getElementById('form');
        myContainerForm.reset();
      });
    } else{
      alert("Paswoord is niet hetzelfde");
    }
  }

  //check if token is created
  login(login) {
    this.authService.login(login);
  }
}
