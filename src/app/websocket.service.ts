import { Injectable, ViewChild, ViewContainerRef } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { ChatComponent } from './components/chat/chat.component';
import { environment } from '../environments/environment';

@Injectable({ 
  providedIn: 'root'
})
export class WebsocketService {
  private socket:any;
  constructor() { this.socket = io("http://" + window.location.hostname + ":3000",{
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});
  
    }
  connect(): Rx.Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code environment.ws_url as http://localhost:5000
    

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('chat message', (data:any) => {
          console.log("Received message from Websocket Server")
          observer.next(data)
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the next() method is called.
    let observer = {
        next: (data: any) => {
            this.socket.emit('chat message', data);
            
        },
    };
    let test = {
      join:(data:any)=>{
        this.socket.on('connect',() =>{
          this.socket.emit('join',{room:data})
        })
      },
    };
    
    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable,test);

    
  }
  joinRoom(room: string) {
    this.socket.emit('join', room);
  }

}