import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service'
import { ChatService } from '../services/chat.service'
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
// import { userInfo } from 'os';

@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent  implements OnInit, OnDestroy {

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  users: any;
  idtoken = (JSON.parse(localStorage.getItem('token')))['iduser'];
  messages = [];
  constructor(private chat: ChatService, private http: HttpClient, private authService: AuthService) {
    // get data when refreshed
    this.getRequest();
  }

  // ----- GET -----
  getRequest(){
    // get call + responseType = give response as text
    this.http.get(this.GET_SERVER_URL, {responseType: 'json'})
    .subscribe((result) => {
      //console.log(JSON.stringify(result))
      // put data in to variable for html-usage
      this.users = result;
    });
   
  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      //get info loggedin user
      let usernameSearch = this.users.find(x=>x.iduser == this.idtoken);
      let usernameMe = usernameSearch.username;

      //edit message
      msg[usernameMe] = msg["message"];
      delete msg["message"];

      //send message to sockets
      this.messages.push("<p><span>" +usernameMe+ ":</span><br>" + msg[usernameMe]+"</p>");
      //this.messages.push(msg[usernameMe]);
      console.log("Response from websocket: " + msg);
    });
  }

  sendMessage(message, event){
    //get value of textarea input
    let elem = document.querySelector("#chatMessage") as HTMLInputElement;

    event.preventDefault();
    
    //check if textarea is empty
    if(elem.value != "" && elem.value != null){
      console.log('new message to websocket: '+ message);
      this.chat.sendMsg(message);
    }

    //clearing textarea after message sent
    elem.value = null;
  }

  ngOnDestroy() {
  }
}

