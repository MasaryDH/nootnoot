import { Injectable } from "@angular/core";

//Rx importeren
import * as Rx from 'rxjs';

//import { webSocket } from "rxjs/webSocket";
//import "rxjs/add/operator/map";
//import { Subject } from "rxjs";


@Injectable()

export class SocketService {

  constructor() {}

  //socket access place that we will subscribe to
  private subject: Rx.Subject<MessageEvent>;

  //The connect method allows us to connect to any WebSocket url
  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      // create() is the place where all the WebSocket — RxJS patching takes place.
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }


  //create new WebSocket
  private create(url): Rx.Subject<MessageEvent> {
    let ws = new WebSocket(url);
    //provide an observable to a RxJS subject,  
    let observable = Rx.Observable.create(
      // receive data from our socket and push it to the subscribers
    (obs: Rx.Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
    })
     //provide an observer 
let observer = {
  //this function will take care of sending information back to the WebSocket
        next: (data: Object) => {
          //check if the WebSocket is still open
            if (ws.readyState === WebSocket.OPEN) {
              //convert to JSON
                ws.send(JSON.stringify(data));
            }
        }
    }
    return Rx.Subject.create(observer, observable);
  }

}