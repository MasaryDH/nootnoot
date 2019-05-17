import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  POST_SERVER_URL = "http://localhost/nootnoot/users";

  constructor(private http: HttpClient) { }

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
        console.log(JSON.stringify(status));

        let myContainerForm = <HTMLFormElement> document.getElementById('form');
        myContainerForm.reset();
      });
    } else{
      alert("Password doesn't match!");
    }
   
  }
}
