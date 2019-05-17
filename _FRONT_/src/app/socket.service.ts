import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import "rxjs/add/operator/map";
import { Subject } from "rxjs";

@Injectable()
export class SocketService {
  private subject;

  constructor() { 
    this.subject = webSocket("ws://localhost:5588");
    this.subject.subscribe();
    //this.subject.next("iets");
  }

  sendMessage(msg: Object) {
    this.subject.next(msg);
  }

  getMessage() {
    return this.subject; 
  }
  
}
