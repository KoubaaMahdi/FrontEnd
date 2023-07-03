import { Component, EventEmitter, Output} from '@angular/core';
import { ChatService } from '../../chat.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent {
  
  messagee: FormControl = new FormControl();
  constructor(private chat: ChatService){}
  @Output() sendClick = new EventEmitter<void>();
  public textArea: string = "";
  public isEmojiPickerVisible: boolean | undefined;
  keyupEnter: any;
  addEmoji(event:any){
    const input = document.getElementById('textarea') as HTMLInputElement | null;
    if(input){
      input.value +=event.emoji.native
    }
    console.log(event.emoji.native)
  }
  picker(){
    const emoji = document.getElementById("emojis")
    if(emoji){
      if (emoji.classList.contains("hidden")) {
        emoji.setAttribute("class","")
      }
      else{
        emoji.setAttribute("class","hidden")
      }
    }
  }
  uploadProgress: number = 0;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB <= 10) { // Check if file size is within limit (e.g., 10MB)
      // Perform your file upload logic here
      const formData: FormData = new FormData();
      formData.append('file', file);

      // Simulate file upload progress (replace with actual upload logic)
      this.simulateUploadProgress(formData);
    } else {
      alert('File size exceeds the limit.'); // Show an error message if file size is too large
    }
  }

  simulateUploadProgress(formData: FormData) {
    const file: File | null = formData.get('file') as File;
  if (!file) {
    return;
  }

  const totalSize = file.size;
    
    const chunkSize = 1024 * 1024; // 1MB chunk size for simulation
    let uploadedSize = 0;

    const simulateProgress = setInterval(() => {
      if (uploadedSize < totalSize) {
        uploadedSize += chunkSize;
        this.uploadProgress = (uploadedSize / totalSize) * 100;
      } else {
        clearInterval(simulateProgress);
        this.uploadProgress = 0;
        alert('File uploaded successfully!');
      }
    }, 1000); // Simulate progress every second (adjust interval as needed)
  }
}
