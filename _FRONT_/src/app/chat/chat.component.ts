import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  users: any;

  constructor(private http: HttpClient){
    // get data when refreshed
    this.getRequest();
  }

  // ----- GET -----
  getRequest(){
    // get call + responseType = give response as text
    this.http.get(this.GET_SERVER_URL, {responseType: 'json'})
    .subscribe((result) => {
      console.log(JSON.stringify(result))

      // put data in to variable for html-useage
      this.users = result;
    });
  }

}
