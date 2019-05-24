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

  OnlineTable(){
       let elem = document.getElementById("tableOnline");
       let hide = elem.style.display =="none";

       let arrow = document.getElementById('arrowOnline');
       arrow.innerHTML = '&#9656;';
       if (hide) {
           elem.style.display="block";
           arrow.innerHTML = '&#9662;';
      } 
      else {
         elem.style.display="none";
         arrow.innerHTML = '&#9656;';
      }
  }
  OfflineTable(){
       var elem = document.getElementById("tableOffline");
       var hide = elem.style.display =="none";

       let arrow = document.getElementById('arrowOffline');
       arrow.innerHTML = '&#9656;';
       if (hide) {
           elem.style.display="block";
           arrow.innerHTML = '&#9662;';
      } 
      else {
         elem.style.display="none";
         arrow.innerHTML = '&#9656;';
      }
  }

}
