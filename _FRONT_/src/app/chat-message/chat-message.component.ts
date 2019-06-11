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
  audioBuzzer;
  interval;
  count = 0;

  constructor(private chat: ChatService, private http: HttpClient, private authService: AuthService) {
    // get data when refreshed
    this.getRequest();
    //load notification sound
    this.audio = new Audio("../../assets/sounds/msn-sound.mp3");
    this.audioBuzzer = new Audio("../../assets/sounds/nudge.mp3");
    // this.audioBuzzer = new Audio("../../assets/sounds/NootNoot.mp3");

    this.checkIsActive();
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

      let usernameSearch = this.users.find(x=>x.iduser == this.idtoken);
      let username = usernameSearch.username;

      //check if you have send a buzzer
      if(msg["message"] == ":buzzer:" && username == msg["name"]){
        this.messages.push(`<p title="`+dateTime+`"> Buzzer is verzonden </p>`);
        console.log("Response from websocket: A buzzer has been send");
      }

      //check if message is a buzzer and not your buzzer
      if(msg["message"] == ":buzzer:" && username!= msg["name"]){
        //send message to sockets
        this.messages.push(`<p title="`+dateTime+`">${msg.name} heeft je een buzzer gestuurd</p>`);
        console.log("Response from websocket: You got buzzed");

        //add class buzzer to html tagg
        let buzzer = document.getElementsByTagName('html')[0];
        buzzer.classList.add("buzzer");
        //play buzzer sound
        this.audioBuzzer.play();

        //remove class buzzer from html tagg after 2 sec
        setTimeout(function(){
          let buzzer = document.getElementsByTagName('html')[0];
          buzzer.classList.remove("buzzer");
        }, 2000);

        this.setTitle();
        navigator.vibrate([1000, 500, 1000]);
      }

      //check if message is a buzzer or message
      if (msg["message"] != ":buzzer:"){
        //send message to sockets
        this.messages.push(`<p title="`+dateTime+`">${msg.name}: ${msg.message}</p>`);
        console.log("Response from websocket: " + msg);

        // play sound if there is a new message
        if (username != msg["name"]){
          this.audio.play();
          this.setTitle();
          navigator.vibrate([1000, 500, 1000]);
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
          //console.log(resultPut)
          });
        }
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
    //clearing textarea after message send
    elem.value = null;
  }

  //show old messages from database
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

  //change title browser tab on incoming message only if browser tab is inactive
  setTitle() {
    this.count++;
    if(document.hidden){
      document.title = "("+ this.count +") | NootNoot";
    } else {
      document.title = "NootNoot";
    }
  }

  //check if browser tab is active
  checkIsActive() {
    this.interval = setInterval(() => {
      if(!document.hidden){
        document.title = "NootNoot";
        this.count = 0;
      }
    }, 1000);
  }

  //send a buzzer with websockets
  buzzer(){
    //get username of person who send buzzer
    let usernameSearch = this.users.find(x=>x.iduser == this.idtoken);
    let username = usernameSearch.username;

    // Send Buzzer 
    this.chat.sendMsg(JSON.stringify({'message':":buzzer:",'user':username}));
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

