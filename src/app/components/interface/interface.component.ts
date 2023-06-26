import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../chat.service';
import { ChatRComponent } from '../chat-r/chat-r.component';
import { ChatComponent } from '../chat/chat.component'
import { KeycloakService } from 'keycloak-angular';
import {  KeycloakProfile } from 'keycloak-js';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatTextComponent } from '../chat-text/chat-text.component';
import { SendComponent } from '../send/send.component';

@Component({
  selector: 'app-root',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  currentUserString = localStorage.getItem('currentUser');
  event:any
  username:any
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
// Now you can use 'currentUser' variable in your code

  selectedPerson: any;
  cls = "entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md border-l-4";
  peopleList: any[] = [];
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  @ViewChild('msgsContainer', { read: ViewContainerRef }) 
  msgsContainer!: ViewContainerRef;
  @ViewChild('ChattingWith', { read: ViewContainerRef }) 
  ChattingWith!: ViewContainerRef;
  boxMsg :any
  constructor(private router: Router,private readonly keycloak: KeycloakService,private chat: ChatService,private http: HttpClient) {}
  room = ""
  childCount: number = 0;
  maxChildCount: number = 14;
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  currentDate = new Date();
  day = this.currentDate.getDate();
  month = this.monthNames[this.currentDate.getMonth()];
  formattedDate = `${this.day} ${this.month}`;
  async ngOnInit() {
    this.chat.connectClient();
    
    if(!this.currentUserString){
      this.router.navigate(['/'])
    }
    this.chat.messages.subscribe(msg => {
      let a :any
      const local = localStorage.getItem('currentUser')
      if(msg.event=="private msg"){
        if(this.room==msg.username){
          a = this.container.createComponent(ChatComponent);
          a.instance.name=msg.username
          a.instance.photo=msg.username[0]+msg.username[1]
        }
          else if(this.room==msg.room) {
            a = this.container.createComponent(ChatRComponent);
          }
          a.instance.message = msg.value;
          a.instance.date=this.formattedDate
        
      }
    
      
      else if(local){
        const {name} =JSON.parse(local) as { name: string };
        
        if(msg.username!=name){
        
          a = this.container.createComponent(ChatComponent);
          a.instance.name=msg.username
          a.instance.photo=msg.username[0]+msg.username[1]
        
       }else{
          a = this.container.createComponent(ChatRComponent);
       }
       a.instance.message = msg.value;
       a.instance.date=this.formattedDate
     }
      });
      
  }

  async getUsers(){
    if(this.ChattingWith){
      this.ChattingWith.clear();
    }
    if(this.container){
      this.container.clear();
    }
    this.boxMsg = document.getElementById("box") 
    this.boxMsg?.setAttribute("class","hidden")
    this.event="private msg"
    let retry = true;
    while(retry){
      try{
        const test = localStorage.getItem('currentUser')
        
        if(test){
        const { token,name } = JSON.parse(test) as { token: string ,name:string};
        const tokenUrl = 'http://'+window.location.hostname+':8080/admin/realms/myreal/groups/75f34879-bcb4-4b00-8bbc-a5e51c82dad2/members';
        const tokenHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+token
        });
        const tokenResponse: any = await this.http.get(tokenUrl, { headers: tokenHeaders }).toPromise();
        this.peopleList=[]
        Object.keys(tokenResponse).forEach(key => {
          const e = tokenResponse[key];
          if(e.username!=name){
            
            this.peopleList.push({ name: e.username, active: this.cls ,photo :e.username[0]+e.username[1]});
          }
        });}
        retry=false
    }catch(error:any){
        const test = localStorage.getItem('currentUser')
        if(test){const { refresh,name } = JSON.parse(test) as { refresh: string,name:string };
        const tokenUrll ='http://'+window.location.hostname+':8080/realms/myreal/protocol/openid-connect/token'
        const tokenHeaderss = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        });
        const tokenBody = new URLSearchParams();
        tokenBody.set('grant_type', 'refresh_token');
        tokenBody.set('client_id', 'angular-id');
        tokenBody.set('refresh_token', refresh);
        tokenBody.set('client_secret', 'ZPI7KVeI23AymvZ4aU0FXSa2vX5oG5gJ');
        
        const tokenResponsee: any = await this.http.post(tokenUrll, tokenBody.toString(), { headers: tokenHeaderss }).toPromise();
        
        const accessToken=tokenResponsee?.access_token;
        const refresh_token=tokenResponsee?.refresh_token;
        localStorage.setItem('currentUser', JSON.stringify({ name: name,token: accessToken,refresh: refresh_token }));
        retry=true}
    }
    }
    

}
  
    
    
  getRooms(){
    if(this.ChattingWith){
      this.ChattingWith.clear();
    }
    if(this.container){
      this.container.clear();
    }
    this.boxMsg = document.getElementById("box") 
    this.boxMsg?.setAttribute("class","hidden")
    this.event="chat message"
    this.peopleList=[]
    this.peopleList.push({ name: 'Room1',  active: this.cls ,photo : "R1"})
    this.peopleList.push({ name: 'Room2',  active: this.cls ,photo : "R2"})
    this.peopleList.push({ name: 'Room3',  active: this.cls ,photo : "R3"})
  }
  
  removeActive(person : any){
    if(this.ChattingWith ){
      this.ChattingWith.clear();
    }
    const chatting = this.ChattingWith.createComponent(ChatTextComponent)
    chatting.instance.name=person.name
    this.boxMsg = document.getElementById("box") 
    this.boxMsg?.setAttribute("class","")
    
    if(this.container && person.name!=this.room){
      this.container.clear();
    }
    this.room=person.name
    this.chat.joinRoom(this.room)
    for (let people of this.peopleList){
      if(people.name==person.name)
      people.active="border-red-500 "+people.active
      else if(people.active.includes("border-red-500 ")){
        people.active=people.active.slice(15);
      }
    }
  }
  search(name: string | undefined) {
    for (let people of this.peopleList){
      if(!people.name.includes(name))
      people.active+=" hidden"
      if((name===""||people.name.includes(name)) && (people.active.includes(" hidden"))){
        people.active=people.active.slice(0, -7);
      }
    }
  }
  updateValue(){
    const input = document.getElementById('search') as HTMLInputElement | null;
    const value = input?.value;
    this.search(value);
  }
  sendMessage() {
    let name :any
    if(this.currentUserString){
        name  = JSON.parse(this.currentUserString) as { name:string };
        name=name.name
    }
    if(this.room!=""){
    const a = this.container.createComponent(ChatRComponent);
    const input = document.getElementById('msg') as HTMLInputElement | null;
    const value = input?.value || ''; // Assign a default value if input?.value is undefined
    if(input){
      input.value ="";
    }
    a.instance.message = value;
    a.instance.date=this.formattedDate
    this.chat.sendMsg({ value: value, room: this.room,event:this.event,username :name});
    }
  }
  getMsgsContainerStyles() {
    const maxHeight = 32 * this.maxChildCount; // Set the height based on the desired height of a single child element
    return {
      'max-height': `${maxHeight}px`
    };
  }
}
export default InterfaceComponent