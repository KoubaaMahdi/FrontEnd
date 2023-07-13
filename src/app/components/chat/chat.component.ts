import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
  
})
export class ChatComponent {
  @Input() photo:string ='';
  @Input() name:string='';
  @Input() message:string='';
  @Input() date :string='';
  @Input() file: boolean = false; // Add the file input property

}
