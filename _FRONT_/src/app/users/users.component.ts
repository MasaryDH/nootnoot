import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  users: any;

  constructor(private http: HttpClient){
    this.getRequest();
  }

  getRequest(){
    this.http.get(this.GET_SERVER_URL).subscribe((result) => {
      console.log(JSON.stringify(result));
      this.users = result;

    });
    
  }

}
