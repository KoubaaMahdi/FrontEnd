import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
  
})
export class ChatComponent {
@Input() message:string='';
@Input() date :string='';
}
