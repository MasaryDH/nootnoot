import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service'
import { ChatService } from '../services/chat.service'
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import emoji from '../../assets/emoji.json';
import { EmojifyModule } from 'angular-emojify';
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
  emojis = emoji;
  // emoji = this.emojis;

  constructor(private chat: ChatService, private http: HttpClient, private authService: AuthService) {
    // get data when refreshed
    this.getRequest();

    console.log(this.emojis);
    // let test = this.emoji.filter(item => item.name)[0];
    // console.log(test.emoji);
    // console.log(test.shortname);
    
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

   //append clicked smileys to textarea
   appendEmoji(emoji){
    let elem = document.querySelector("#chatMessage") as HTMLInputElement;
    elem.value += emoji;
  }

  //open smiley emotions
  openModalSmiley(){
    let modal = document.getElementById("modalSmiley");
    modal.style.display = "block";
  }
  closeModalSmiley(){
    let modal = document.getElementById("modalSmiley");
    modal.style.display = "none";
  }

  //open smiley emotions
  openModalNature(){
    let modal = document.getElementById("modalNature");
    modal.style.display = "block";
  }
  closeModalNature(){
    let modal = document.getElementById("modalNature");
    modal.style.display = "none";
  }

  //open food and drinks emotions
  openModalFood(){
    let modal = document.getElementById("modalFood");
    modal.style.display = "block";
  }
  closeModalFood(){
    let modal = document.getElementById("modalFood");
    modal.style.display = "none";
  }

  ngOnDestroy() {
  }
}

