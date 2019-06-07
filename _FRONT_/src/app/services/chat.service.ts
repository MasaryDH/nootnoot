import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { map } from 'rxjs/operators';
// const CHAT_URL = 'ws://localhost:8080/';
const CHAT_URL = 'ws://wdev.be:8080/samd/';


export interface Message {
    message: string,
    name?: string
}

@Injectable()
export class ChatService {
    public messages: Subject<Message>;

    constructor(wsService: SocketService) {
        this.messages = <Subject<Message>>wsService
            .connect(CHAT_URL)
            .pipe(map((response: MessageEvent): Message => {
                let data = response.data;
                return {
                    message: JSON.parse(data).message,
                    name: JSON.parse(data).user,
                }
            }));
    }

    sendMsg(msg){
      this.messages.next(msg);
      console.log("Msg:" + msg);
    }
}