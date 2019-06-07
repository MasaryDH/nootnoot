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
  order: string = "order";
  constructor(private chat: ChatService, private http: HttpClient, private authService: AuthService) {
    // get data when refreshed
    this.getRequest();
  }

  // ----- GET -----
  getRequest(){
    // get call + responseType = give response as text
    this.http.get(this.GET_SERVER_URL, {responseType: 'json'})
    .subscribe((result) => {
      // put data in to variable for html-usage
      this.users = result;
    });
   
  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      //send message to sockets
      this.messages.push(`${msg.name}: ${msg.message}`);
      console.log("Response from websocket: " + msg);
    });
  }

  ngOnDestroy() {
  }

  sendMessage(message, event){
    //get value of textarea input
    let elem = document.querySelector("#chatMessage") as HTMLInputElement;

    event.preventDefault();
    
    //check if textarea is empty
    if(elem.value != "" && elem.value != null){

      //get info loggedin user
      let usernameSearch = this.users.find(x=>x.iduser == this.idtoken);
      let username = usernameSearch.username;

      // Send Logged-in user + Message 
      // console.log('new message to websocket: '+ message);
      this.chat.sendMsg(JSON.stringify({'message':message,'user':username}));
    }

    //clearing textarea after message sent
    elem.value = null;
  }

  //append clicked smileys to textarea
  appendEmoji(emoji){
    let elem = document.querySelector("#chatMessage") as HTMLInputElement;
    elem.value += emoji;
  }

  //* M O D A L S
  //open Smiley emotions
  openModalSmiley(){
    let modal = document.getElementById("modalSmiley");
    modal.style.display = "block";
  }
  closeModalSmiley(){
    let modal = document.getElementById("modalSmiley");
    modal.style.display = "none";
  }

  //open Nature emotions
  openModalNature(){
    let modal = document.getElementById("modalNature");
    modal.style.display = "block";
  }
  closeModalNature(){
    let modal = document.getElementById("modalNature");
    modal.style.display = "none";
  }

  //open Food and Drinks emotions
  openModalFood(){
    let modal = document.getElementById("modalFood");
    modal.style.display = "block";
  }
  closeModalFood(){
    let modal = document.getElementById("modalFood");
    modal.style.display = "none";
  }

  //open Activity emotions
  openModalActivity(){
    let modal = document.getElementById("modalActivity");
    modal.style.display = "block";
  }
  closeModalActivity(){
    let modal = document.getElementById("modalActivity");
    modal.style.display = "none";
  }

  //open Places emotions
  openModalPlaces(){
    let modal = document.getElementById("modalPlaces");
    modal.style.display = "block";
  }
  closeModalPlaces(){
    let modal = document.getElementById("modalPlaces");
    modal.style.display = "none";
  }

  //open Object emotions
  openModalObject(){
    let modal = document.getElementById("modalObject");
    modal.style.display = "block";
  }
  closeModalObject(){
    let modal = document.getElementById("modalObject");
    modal.style.display = "none";
  }

  //open Symbol emotions
  openModalSymbol(){
    let modal = document.getElementById("modalSymbol");
    modal.style.display = "block";
  }
  closeModalSymbol(){
    let modal = document.getElementById("modalSymbol");
    modal.style.display = "none";
  }

  //open Flag emotions
  openModalFlag(){
    let modal = document.getElementById("modalFlag");
    modal.style.display = "block";
  }
  closeModalFlag(){
    let modal = document.getElementById("modalFlag");
    modal.style.display = "none";
  }

  // playAudio(){
  //   this.audio = new Audio();
  //   this.audio.src = "../../assets/sounds/msn-sound.mp3";
  //   this.audio.load();
  //   this.audio.play();
  // }

}

