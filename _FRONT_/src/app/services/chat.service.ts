import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { map } from 'rxjs/operators';
const CHAT_URL = 'ws://localhost:8080/';

export interface Message {
    message: string,
    name?: string
}

@Injectable()
export class ChatService {
    public messages: Subject<Message>;
    //subscribe to the SocketService
    constructor(wsService: SocketService) {
        //listen to incoming messages
        this.messages = <Subject<Message>>wsService
        //connect to the socket server 
            .connect(CHAT_URL)
            .pipe(map((response: MessageEvent): Message => {
                let data = response.data;
                return {
                    //convert to JSON
                    message: JSON.parse(data).message,
                    name: JSON.parse(data).user,
                }
            }));
    }
    //Display messages in the terminal(optional)
    sendMsg(msg){
      this.messages.next(msg);
      console.log("Msg:" + msg);
    }
}