import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/chat.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  @Output() sendClick = new EventEmitter<void>();
  constructor(private router: Router,private chat :ChatService){}
  ConnectedUser : any
  ngOnInit(){
    const st = localStorage.getItem('currentUser')
    if(st){
      const{name} = JSON.parse(st) as { name:string };
      this.ConnectedUser=name
    }
  }
  logout(){
    localStorage.removeItem('currentUser')
    this.router.navigate([''])
    this.chat.disconnect();

  }

}
