import { Injectable} from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';


@Injectable({ 
  providedIn: 'root'
})
export class WebsocketService {
  private socket:any;
  constructor() { this.socket = io("http://" + window.location.hostname + ":3000",{
  autoConnect:false,
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});
  
    }
  connect(): Rx.Subject<MessageEvent> {
    
    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('chat message', (data:any) => {
          console.log("Received message from Websocket Server")
          observer.next(data)
        })
        this.socket.on('private msg', (data:any) => {
          observer.next(data)
        })
        this.socket.on('upload room', (data:any) => {
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
          
            this.socket.emit(data.event, data);
            
        },
    };
    
    
    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);

    
  }
  joinRoom(room: string) {
    this.socket.emit('join', room);
  }
  connectClient(){
    const local =localStorage.getItem('currentUser')
        if(local){
          const {name}=JSON.parse(local) as { name: string };
          this.socket.auth={name}
          this.socket.connect();
        }
    
  }
  upload(file: any) {
    this.socket.emit("fileName",file.filename)
    this.socket.emit("upload", file.data, (status:any) => {
      console.log(status);
    });
  }
  disconnect(){
    this.socket.disconnect();
  }


}