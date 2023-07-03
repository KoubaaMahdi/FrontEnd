import { Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from './chat.service';
import { ChatComponent } from './components/chat/chat.component';
import { ChatRComponent } from './components/chat-r/chat-r.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }
}
export default AppComponent

