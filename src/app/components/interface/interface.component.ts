import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../chat.service';
import { ChatRComponent } from '../chat-r/chat-r.component';
import { ChatComponent } from '../chat/chat.component'
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatTextComponent } from '../chat-text/chat-text.component';
import { FileUploadService } from '../../file-upload-service.service'
import { PageEvent } from '@angular/material/paginator';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {
  mongoAPIURL ="https://eu-central-1.aws.data.mongodb-api.com/app/data-jomwf/endpoint/data/v1/action/find"
  apiKEY="vYZMFu5PHi0bPXAi0vVD0hr6KS2gVNyTtoGznikPoElX6wDczjpXva1MNiuThzp1"
  currentUserString = localStorage.getItem('currentUser');
  event:  string=''
  uploadevent : string=''
  username:  string=''
  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  // Now you can use 'currentUser' variable in your code

  selectedPerson: any;
  pageSlice: any[] = []
  cls = "entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md border-l-4";
  peopleList: any[] = [];
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  @ViewChild('msgsContainer', { static: true })
  msgsContainer!: ElementRef;
  @ViewChild('ChattingWith', { read: ViewContainerRef })
  ChattingWith!: ViewContainerRef;
  boxMsg: any
  constructor(private fileUploadService: FileUploadService, private router: Router, private readonly keycloak: KeycloakService, private chat: ChatService, private http: HttpClient) { }
  room = ""
  childCount: number = 0;
  maxChildCount: number = 12;
  currentDate = new Date();
  day = this.currentDate.getDate();
  month = this.monthNames[this.currentDate.getMonth()];
  formattedDate = `${this.day} ${this.month}`;

  async ngOnInit() {
    this.RefreshToken()
    this.chat.connectClient();

    if (!this.currentUserString) {
      this.router.navigate(['/'])
    }
    this.chat.messages.subscribe(async (msg) => {
      let a: any
      const local = localStorage.getItem('currentUser')
      if (msg.event == "private msg") {
        if (this.room == msg.username) {
          a = this.container.createComponent(ChatComponent);
          a.instance.name = msg.username
          a.instance.photo = msg.username[0] + msg.username[1]
        }
        else if (this.room == msg.room) {
          a = this.container.createComponent(ChatRComponent);
        }
        a.instance.message = msg.value;
        a.instance.date = this.formattedDate

      } else if (msg.event == "private upload") {
        if (this.room == msg.username) {
          a = this.container.createComponent(ChatComponent);
          a.instance.name = msg.username
          a.instance.photo = msg.username[0] + msg.username[1]
        }
        else if (this.room == msg.room) {
          a = this.container.createComponent(ChatRComponent);
        }
        a.location.nativeElement.style.cursor = 'pointer';
        a.location.nativeElement.addEventListener('click', () => {
          window.location.href = 'http://localhost:5000/remote.php/dav/files/admin/uploaded/' + msg.value; // Replace with your desired link
        });
        a.instance.file = true;

        a.instance.message = msg.value;
        a.instance.date = this.formattedDate;

      } 
      else if (msg.event == "upload room") {
        if (local) {
          const { name } = JSON.parse(local) as { name: string };
          if (msg.username != name) {

            a = this.container.createComponent(ChatComponent);
            a.instance.name = msg.username
            a.instance.photo = msg.username[0] + msg.username[1]

          } else {
            a = this.container.createComponent(ChatRComponent);
          }
        }
        a.location.nativeElement.style.cursor = 'pointer';
        a.location.nativeElement.addEventListener('click', () => {
          window.location.href = 'http://localhost:5000/remote.php/dav/files/admin/uploaded/' + msg.value; // Replace with your desired link
        });
        a.instance.file = true;

        a.instance.message = msg.value;
        a.instance.date = this.formattedDate;

      }
      else if (local) {
        const { name } = JSON.parse(local) as { name: string };

        if (msg.username != name) {

          a = this.container.createComponent(ChatComponent);
          a.instance.name = msg.username
          a.instance.photo = msg.username[0] + msg.username[1]

        } else {
          a = this.container.createComponent(ChatRComponent);
        }
        a.instance.message = msg.value;
        a.instance.date = this.formattedDate
      }
      await new Promise(resolve => setTimeout(resolve, 0));
      this.scrollToBottom();
    });

  }
  async RefreshToken() {
    const test = localStorage.getItem('currentUser')
    try {
      if (test) {
        const { refresh, name } = JSON.parse(test) as { refresh: string, name: string };
        const tokenUrll = 'http://' + window.location.hostname + ':8080/realms/myreal/protocol/openid-connect/token'
        const tokenHeaderss = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
        });
        const tokenBody = new URLSearchParams();
        tokenBody.set('grant_type', 'refresh_token');
        tokenBody.set('client_id', 'angular-id');
        tokenBody.set('refresh_token', refresh);
        tokenBody.set('client_secret', 'ZPI7KVeI23AymvZ4aU0FXSa2vX5oG5gJ');

        const tokenResponsee: any = await this.http.post(tokenUrll, tokenBody.toString(), { headers: tokenHeaderss }).toPromise();

        const accessToken = tokenResponsee?.access_token;
        const refresh_token = tokenResponsee?.refresh_token;
        localStorage.setItem('currentUser', JSON.stringify({ name: name, token: accessToken, refresh: refresh_token }));
      }
    }
    catch (error: any) {
      localStorage.removeItem('currentUser')
      this.router.navigate(['/'])
    }
  }
  async getResponse(path: any) {
    let retry = true
    while (retry) {
      try {
        const test = localStorage.getItem('currentUser')

        if (test) {
          const {token} = JSON.parse(test) as { token: string, name: string };
          const tokenUrl = path;
          const tokenHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token
          });
          const tokenResponse: any = await this.http.get(tokenUrl, { headers: tokenHeaders }).toPromise();
          retry = false
          return tokenResponse;
        }
      } catch {
        await this.RefreshToken()
        retry = true
      }
    }

  }
  async getUsers() {
    if (this.ChattingWith) {
      this.ChattingWith.clear();
    }
    if (this.container) {
      this.container.clear();
    }
    this.boxMsg = document.getElementById("box")
    this.boxMsg?.setAttribute("class", "hidden")
    this.event = "private msg"
    this.uploadevent = "private upload"
    const test = localStorage.getItem('currentUser')

    if (test) {
      const { name } = JSON.parse(test) as { name: string };
      const tokenUrl = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/';
      const tokenResponse: any = await this.getResponse(tokenUrl)
      this.peopleList = []
      Object.keys(tokenResponse).forEach(key => {
        const e = tokenResponse[key];
        if (e.username != name) {

          this.peopleList.push({ name: e.username, active: this.cls, photo: e.username[0] + e.username[1] });
        }
      });
      this.pageSlice = this.peopleList.slice(0, 3)
    }
  }
  async getId(): Promise<string | null> {
    const test = localStorage.getItem('currentUser');
    if (test) {
      const { name } = JSON.parse(test) as { name: string };
      const tokenUrl = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/';
      const userResponse: any = await this.getResponse(tokenUrl);

      if (userResponse && userResponse.length > 0) {
        for (const key of userResponse) {
          if (key.username === name) {
            return String(key.id);
          }
        }
      }
    }

    return null; // Return null if no ID is found
  }

  async getRooms() {
    if (this.ChattingWith) {
      this.ChattingWith.clear();
    }
    if (this.container) {
      this.container.clear();
    }
    this.boxMsg = document.getElementById("box")
    this.boxMsg?.setAttribute("class", "hidden")
    this.event = "chat message"
    this.uploadevent="upload room"
    //let userId: any = ''; // Initialisez la variable userId avec une valeur par défaut
    const userId = await this.getId()
    console.log(userId)



    if (userId) {
      try {
        const roomsUrl = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/' + userId + '/groups';
        const roomsResponse: any = await this.getResponse(roomsUrl)
        this.peopleList = [];
        Object.keys(roomsResponse).forEach(key => {
          const room = roomsResponse[key];
          // Vous pouvez adapter cette logique selon la structure de réponse attendue de l'API Keycloak
          const roomId = room.id;
          const roomName = room.name;
          this.peopleList.push({ name: roomName, active: this.cls, photo: roomName[0] + roomName[1] });
        });
        this.pageSlice = this.peopleList.slice(0, 3)

      } catch (error: any) {
        console.error('Erreur lors de la récupération des salles :', error);
      }
    }

  }
  async removeActive(person: any) {
    const user = localStorage.getItem('currentUser')
    if (this.ChattingWith) {
      this.ChattingWith.clear();
    }
    const chatting = this.ChattingWith.createComponent(ChatTextComponent)
    chatting.instance.name = person.name
    this.boxMsg = document.getElementById("box")
    this.boxMsg?.setAttribute("class", "")

    if (this.container && person.name != this.room) {
      this.container.clear();
    }
    this.room = person.name
    this.chat.joinRoom(this.room)
    for (let people of this.peopleList) {
      if (people.name == person.name)
        people.active = "border-red-500 " + people.active
      else if (people.active.includes("border-red-500 ")) {
        people.active = people.active.slice(15);
      }
    }
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers':'POST',
      'api-key': this.apiKEY,
      'Accept':'application/json'
    });
    if(user){
      const { name } = JSON.parse(user) as { name: string };
      if(this.event==="chat message"){
        const body = {
          "dataSource": "ChatDataBase",
          "database": "messages",
          "collection": "messages",
          "filter": {
            "event": { "$in": [this.event, this.uploadevent] },
            "reciever" : this.room
          },
          "sort": {
            "date": 1
          }
        }
        let mongoReponse: any = await this.http.post(this.mongoAPIURL, body, { headers: header });
        mongoReponse = await firstValueFrom(mongoReponse)
        console.log(mongoReponse)
      }else{

      }
    }
  }
  search(name: string | undefined) {
    for (let people of this.peopleList) {
      if (!people.name.includes(name))
        people.active += " hidden"
      if ((name === "" || people.name.includes(name)) && (people.active.includes(" hidden"))) {
        people.active = people.active.slice(0, -7);
      }
    }
  }
  updateValue() {
    const input = document.getElementById('search') as HTMLInputElement | null;
    const value = input?.value;
    this.search(value);
  }
  async sendMessage() {
    let name: any
    if (this.currentUserString) {
      name = JSON.parse(this.currentUserString) as { name: string };
      name = name.name
    }
    if (this.room != "") {
      const input = document.getElementById('textarea') as HTMLInputElement | null;
      const paragraphs = document.querySelectorAll('div.file-link p');
      paragraphs.forEach((paragraph: Element) => {
        // Access each paragraph here
        const valueFile = paragraph.textContent;
        if (valueFile && this.fileUploadService.getUploadStatus()) {
          if(this.event==="private msg"){
            this.chat.sendMsg({ value: valueFile.replace(/\s/g, ''), room: this.room, event: this.uploadevent, username: name })
          }
          else{
            this.chat.sendMsg({ value: valueFile.replace(/\s/g, ''), room: this.room, event: this.uploadevent, username: name })
          }
          const a = this.container.createComponent(ChatRComponent);

          // Apply CSS styles to make it look like a link
          a.location.nativeElement.style.cursor = 'pointer';


          // Add a click event listener to the component
          a.location.nativeElement.addEventListener('click', () => {
            // Handle the click event here
            window.location.href = 'http://localhost:5000/remote.php/dav/files/admin/uploaded/' + valueFile.replace(/\s/g, '');; // Replace with your desired link
          });
          a.instance.file = true;

          a.instance.message = valueFile;
          a.instance.date = this.formattedDate;
        }
      });




      const value = input?.value || ''; // Assign a default value if input?.value is undefined
      if (value.trim().length !==0) {
        const a = this.container.createComponent(ChatRComponent);
        if (input) {
          input.value = "";
        }
        a.instance.message = value;
        a.instance.date = this.formattedDate
        this.chat.sendMsg({ value: value, room: this.room, event: this.event, username: name });
      }

    }
    await new Promise(resolve => setTimeout(resolve, 0));
      this.scrollToBottom();


  }
  getMsgsContainerStyles() {
    const maxHeight = 32 * this.maxChildCount; // Set the height based on the desired height of a single child element
    return {
      'max-height': `${maxHeight}px`
    };
  }
  scrollToBottom() {
    const container = this.msgsContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  async logout() {
    const test = localStorage.getItem('currentUser')
    let userID = await this.getId()
    try {
      if (test) {
        const { token, name } = JSON.parse(test) as { token: string, name: string };
        const tokenUrll = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/' + userID + '/logout/'
        const tokenHeaderss = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        });
        const tokenResponsee: any = await this.http.post(tokenUrll, null, { headers: tokenHeaderss }).toPromise();
        console.log(tokenResponsee)
        localStorage.removeItem('currentUser')
        this.router.navigate(['/'])
      }
    }
    catch (error: any) {
      this.RefreshToken()
    }

  }
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.peopleList.length) {
      endIndex = this.peopleList.length
    }
    this.pageSlice = this.peopleList.slice(startIndex, endIndex)

  }
}
export default InterfaceComponent