import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-chat-r',
  templateUrl: './chat-r.component.html',
  styleUrls: ['./chat-r.component.css']
})
export class ChatRComponent {
  @Input() message:string='';
  @Input() date :string='';
}
