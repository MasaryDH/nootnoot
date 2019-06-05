import { Component, OnInit,OnDestroy  } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service'
import { ChatService } from '../services/chat.service'
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent  implements OnInit, OnDestroy {


  messages = [];
  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      this.messages.push(msg);
      console.log("Response from websocket: " + msg);
    });
  }

  sendMessage(message: string){
    console.log('new message from client to websocket: '+ message);
    this.chat.sendMsg(message);
    
  }

  ngOnDestroy() {
  }
}