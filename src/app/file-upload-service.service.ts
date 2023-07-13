import { Injectable } from '@angular/core';

@Injectable()
export class FileUploadService {
  done = false;

  setUploadStatus(status: boolean) {
    this.done = status;
  }
  getUploadStatus() {
    return this.done
  }
}
