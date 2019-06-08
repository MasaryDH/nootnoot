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
  GETMESSAGE_SERVER_URL = "http://localhost/nootnoot/messages";
  POSTMESSAGE_SERVER_URL = "http://localhost/nootnoot/message";
  users: any;
  texts: any;
  idtoken = (JSON.parse(localStorage.getItem('token')))['iduser'];
  messages = [];
  emojis = emoji;
  order: string = "order";
  audio;

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

    // get messages call + responseType = give response as text
    this.http.get(this.GETMESSAGE_SERVER_URL, {responseType: 'json'})
    .subscribe((resultmsg) => {
      // put data in to variable for html-usage
      this.texts = resultmsg;
    });
  }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
     
      //get date now when message is send
      var today = new Date();
      var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;

      //send message to sockets
      this.messages.push(`<p title="`+dateTime+`">${msg.name}: ${msg.message}</p>`);
      console.log("Response from websocket: " + msg);
      let usernameSearch = this.users.find(x=>x.iduser == this.idtoken);
      let username = usernameSearch.username;

      // play sound if there is e new message
      if (username != msg["name"]){
        this.playAudio();
      }

      //send only your new written text message
      if (username == msg["name"]){
        // creating message data to send with post
        let useridSearch = this.users.find(x=>x.username == msg["name"]);
        let userid = useridSearch.iduser;
        let data = {content: msg["message"], username: msg["name"], user_iduser: userid};

        // POST call
        this.http.post(this.POSTMESSAGE_SERVER_URL, data)
        .subscribe((resultPut) => {
        console.log(resultPut)
        });
      }
      
    });
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

  showOldMessages(){
    let elem = document.getElementById("oldMessages");
    let hide = elem.style.display =="none";

    // change arrow
    let arrow = document.getElementById('arrowOldMessage');
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

  //append clicked smileys to textarea
  appendEmoji(emoji){
    let elem = document.querySelector("#chatMessage") as HTMLInputElement;
    elem.value += emoji;
  }

  //sound to play
  playAudio(){
    this.audio = new Audio();
    this.audio.src = "../../assets/sounds/msn-sound.mp3";
    this.audio.load();
    this.audio.play();
  }

  ngOnDestroy() {
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

}

