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
    this.http.post(this.POST_SERVER_URL, person, {responseType: 'text'})
    .subscribe((status)=> {
       console.log(JSON.stringify(status));
    });
  }
}
