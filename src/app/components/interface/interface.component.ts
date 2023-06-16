import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../chat.service';
import { ChatRComponent } from '../chat-r/chat-r.component';
import { ChatComponent } from '../chat/chat.component'


@Component({
  selector: 'app-root',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  
  selectedPerson: any;
  cls = "entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md border-l-4";
  peopleList: any[] = [
    { name: 'Room1', date: '12 april', notification: 23, active: this.cls },
    { name: 'Room2', date: '12 april', notification: 85 ,active: this.cls},
    { name: 'Room3', date: '12 mars', notification: 2,active: this.cls}
  ];
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  @ViewChild('msgsContainer', { read: ViewContainerRef }) 
  msgsContainer!: ViewContainerRef;
  constructor(private chat: ChatService) {}
  room = "room"
  childCount: number = 0;
  maxChildCount: number = 14;
  ngOnInit() {
    
    this.removeActive(this.peopleList[0]);
    this.chat.messages.subscribe(msg => {
      const a = this.container.createComponent(ChatComponent);
      a.instance.message = msg;
      a.instance.date="15april"
    });
  }

    
    
  
  
  removeActive(person : any){
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
        console.log(people.active)
      }
      

    }
  }


  updateValue(){
    const input = document.getElementById('search') as HTMLInputElement | null;
    const value = input?.value;
    this.search(value);
  }
  sendMessage() {
    const a = this.container.createComponent(ChatRComponent);
    const input = document.getElementById('msg') as HTMLInputElement | null;
    const value = input?.value || ''; // Assign a default value if input?.value is undefined
    if(input){
      input.value ="";
    }
    a.instance.message = value;
    a.instance.date="15april"
    this.chat.sendMsg({ value: value, room: this.room });
  }
  getMsgsContainerStyles() {
    const maxHeight = 32 * this.maxChildCount; // Set the height based on the desired height of a single child element
    return {
      'max-height': `${maxHeight}px`
    };
  }
  
  
}
export default InterfaceComponent