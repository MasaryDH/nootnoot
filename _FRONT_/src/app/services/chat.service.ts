import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { map } from 'rxjs/operators';
const CHAT_URL = 'ws://localhost:8080/';

export interface Message {
    message: string
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
                    message: data
                }
            }));
    }

    sendMsg(msg){
      this.messages.next(msg);
    }
}