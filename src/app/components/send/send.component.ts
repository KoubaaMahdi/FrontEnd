import { Component, EventEmitter, Output} from '@angular/core';
import AppComponent from 'src/app/app.component';
import { ChatService } from 'src/app/chat.service';
import { WebsocketService } from 'src/app/websocket.service';
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent {
  
  @Output() sendClick = new EventEmitter<void>();
  public textArea: string = "";
  public isEmojiPickerVisible: boolean | undefined;
  keyupEnter: any;
  public addEmoji(event:any) {
    this.textArea = `${this.textArea}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

}

