import { Component, EventEmitter, Output } from '@angular/core';
import { ChatService } from '../../chat.service';
import { FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FileUploadService } from '../../file-upload-service.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent {
  file: File[] | undefined;

  selectedFileName: string[] = []; // Variable pour stocker le nom du fichier sélectionné
  active: boolean = false
  messagee: FormControl = new FormControl();
  constructor(private fileUploadService: FileUploadService, private chat: ChatService) { }
  @Output() sendClick = new EventEmitter<void>();
  public textArea: string = "";
  public isEmojiPickerVisible: boolean | undefined;
  keyupEnter: any;
  
  addEmoji(event: any) {
    const input = document.getElementById('textarea') as HTMLInputElement | null;
    if (input) {
      input.value += event.emoji.native
    }
    console.log(event.emoji.native)
  }
  async picker() {
    document.addEventListener("click", function(event) {
      const emojiMart = document.getElementById("emojis");
      const targetElement = event.target as Node; // Clicked element
    
      // Check if the clicked element is outside the emoji mart
      if (emojiMart && !emojiMart.contains(targetElement)) {
        if (!emojiMart.classList.contains("hidden")) {
          emojiMart.classList.add("hidden");
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    const emoji = document.getElementById("emojis")
    if (emoji) {
      if (emoji.classList.contains("hidden")) {
        emoji.setAttribute("class", "")
      }
      else {
        emoji.setAttribute("class", "hidden")
      }
    }
  }
  uploadProgress: number = 0;

  onFileSelected() {
    if (this.file && this.file.length > 0) {
      const fileSizeLimitInMB = 100;
      let allFilesWithinLimit = true;

      this.file.forEach((file: File) => {
        const fileSizeInMB = file.size / (1024 * 1024);

        if (fileSizeInMB > fileSizeLimitInMB) {
          allFilesWithinLimit = false;
          // Handle case when file size exceeds the limit (e.g., show an error message)
          console.log('File size exceeds the limit:', file.name);
        }
      });

      if (allFilesWithinLimit && this.fileUploadService.getUploadStatus()) {
        this.file.forEach((file: File) => {
          this.chat.sendFile({ data: file, filename: file.name.replace(/\s/g, '') });
        });

        this.file = undefined;
        this.selectedFileName = [];
        this.active = false;
        this.uploadProgress = 0;

        // Simulate file upload progress (replace with actual upload logic)
      }
    }
  }


  simulateUploadProgress(file: File) {

    this.fileUploadService.setUploadStatus(false)
    const totalSize = file.size;

    const chunkSize = 1024 * 1024; // 1MB chunk size for simulation
    let uploadedSize = 0;

    const simulateProgress = setInterval(() => {
      if (uploadedSize < totalSize) {
        uploadedSize += chunkSize;
        this.uploadProgress = (uploadedSize / totalSize) * 100;
      } else {
        this.fileUploadService.setUploadStatus(true)
        clearInterval(simulateProgress)


      }
    }, 1000); // Simulate progress every second (adjust interval as needed)
  }
  handleFileChange(event: any, filee: any) {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files) as File[]  // Convert the selected files into an array
      this.file = this.file ? [...this.file, ...newFiles] : newFiles; // Append new files to the already stored files or set the new files if no files are stored
      this.file.forEach((file: File) => {
        if (!this.selectedFileName.includes(file.name)) {
          this.selectedFileName.push(file.name);
        }
        this.active = true;
        this.simulateUploadProgress(file);
      });

      filee.value = '';
    }
  }


}
