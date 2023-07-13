import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ShowUsersPopUpComponent } from '../show-users-pop-up/show-users-pop-up.component';
import { ShowRemoveUserPopUpComponent } from '../show-remove-user-pop-up/show-remove-user-pop-up.component'
import { AddUsersPopUpComponent } from '../add-users-pop-up/add-users-pop-up.component'
import { PageEvent } from '@angular/material/paginator';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Component({
  selector: 'app-interface-admin',
  templateUrl: './interface-admin.component.html',
  styleUrls: ['./interface-admin.component.css'],


})
export class InterfaceAdminComponent {
  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog) { }
  currentUserString = localStorage.getItem('adminUser');

  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email'];
  pageSlice: User[] = []
  async ngOnInit() {
    this.RefreshToken()
    if (!this.currentUserString) {
      this.router.navigate(['/'])
    } else {
      this.getRooms()
      this.getUsers()
    }


  }

  showUsers: boolean = false;
  showRooms: boolean = false;
  showCreateRoom: boolean = false;
  users: User[] = [];
  rooms: Room[] = [];
  newRoomName: string = '';
  RoomsInfo = []
  async logout() {
    const test = localStorage.getItem('adminUser')
    let userID
    try {
      if (test) {
        const { token, name } = JSON.parse(test) as { token: string, name: string };
        this.users.forEach(user => {
          if (user.username === name) {
            userID = user.id
          }
        })
        const tokenUrll = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/' + userID + '/logout/'
        const tokenHeaderss = new HttpHeaders({
          'Authorization': 'Bearer ' + token
        });
        const tokenResponsee: any = await this.http.post(tokenUrll, null, { headers: tokenHeaderss }).toPromise();
        localStorage.removeItem('adminUser')
        this.router.navigate(['/'])
      }
    }
    catch (error: any) {
      this.RefreshToken()
    }

  }
  async RefreshToken() {
    const test = localStorage.getItem('adminUser')
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
        localStorage.setItem('adminUser', JSON.stringify({ name: name, token: accessToken, refresh: refresh_token }));
      }
    }
    catch (error: any) {
      localStorage.removeItem('adminUser')
      this.router.navigate(['/'])
    }
  }
  async getResponse(path: any) {
    let retry = true
    while (retry) {
      try {
        const test = localStorage.getItem('adminUser')

        if (test) {
          const { token, name } = JSON.parse(test) as { token: string, name: string };
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
        this.RefreshToken()
        retry = true
      }
    }

  }
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.users.length) {
      endIndex = this.users.length
    }
    this.pageSlice = this.users.slice(startIndex, endIndex)

  }
  async getUsers() {
    this.users = []
    const tokenUrl = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/';
    const userResponse: any = await this.getResponse(tokenUrl)
    userResponse.forEach((user: any) => {
      let currentUser: User = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
      this.users.push(currentUser)
    })
    this.pageSlice = this.users.slice(0, 4)
    this.showUsers = true;
    this.showRooms = false;
    this.showCreateRoom = false
  }

  async getRooms() {
    // Simulated room data
    this.rooms = []
    const tokenUrl = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/groups/';
    const userResponse: any = await this.getResponse(tokenUrl)
    await Promise.all(userResponse.map(async (room: any) => {
      const Url = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/groups/' + room.id + '/members'
      const Reponse: any = await this.getResponse(Url)
      let currentUser: Room = {
        Name: room.name,
        Count: Reponse.length,
        isDropdownOpen: false,
        id: room.id
      };
      this.rooms.push(currentUser)
    }))
    this.showUsers = false;
    this.showRooms = true;
    this.showCreateRoom = false;

  }
  removeRoom(Room: any) {
    let retry = true

    try {
      this.rooms.forEach(async (signleRoom: any) => {
        if (Room.name == signleRoom.name) {
          const url = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/groups/' + Room.id
          const test = localStorage.getItem('adminUser')
          if (test) {
            const { token } = JSON.parse(test) as { token: string };
            const tokenHeaderss = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            });
            const tokenResponsee: any = await this.http.delete(url, { headers: tokenHeaderss }).toPromise();
            retry = false
            this.getRooms()
          }
        }
      });
    } catch {
      this.RefreshToken()
      retry = true
    }


  }


  async createRoom() {
    // Get the room name from the input field
    console.log("slt")
    const newRoom = document.getElementById("name");
    let retry = true
    if (newRoom instanceof HTMLInputElement) {
      const roomName = newRoom.value;
      console.log(this.rooms)
      this.rooms.forEach(room => {
        console.log(room.Name)
        if (room.Name === roomName ) {
          alert('Name Already Exists')
          retry = false
        }
        

      })
      if(roomName===""){
        alert('choose a name')
        retry = false
      }

      while (retry) {
        try {
          const test = localStorage.getItem('adminUser')

          if (test) {

            const { token } = JSON.parse(test) as { token: string };

            const roomName = newRoom.value;
            const tokenUrll = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/groups'
            const tokenHeaderss = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            });
            const tokenResponsee: any = await this.http.post(tokenUrll, { "name": roomName, "path": '/' + roomName, "subGroups": [] }, { headers: tokenHeaderss }).toPromise();
            retry = false;
            this.getRooms().then(() => {
              this.newRoomName = '';
            
              
            
              this.rooms.forEach((room) => {
                if (room.Name == roomName) {
                  this.dialog
                    .open(AddUsersPopUpComponent, { data: room })
                    .afterClosed()
                    .subscribe(() => {
                      this.getRooms();
                    });
                }
              });
            });
            
          }
        } catch {
          this.RefreshToken()
          retry = true
        }
      }
    }




  }
  showPopUpUsers(room: any) {
    this.dialog.open(ShowUsersPopUpComponent, { data: room })
  }
  showAddPopUp(room: any) {
    this.dialog.open(AddUsersPopUpComponent, { data: room }).afterClosed().subscribe(() => {
      this.getRooms();
    });
  }
  showPopUpRemoveUser(room: any) {
    this.dialog.open(ShowRemoveUserPopUpComponent, { data: room }).afterClosed().subscribe(() => {
      this.getRooms();
    });
  }

}
interface User {
  id: number
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}


interface Room {
  Name: string;
  Count: string;
  id: Number
  isDropdownOpen: boolean
}
