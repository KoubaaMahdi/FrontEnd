import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog  } from '@angular/material/dialog';
import { ShowUsersPopUpComponent } from '../show-users-pop-up/show-users-pop-up.component';
import { ShowRemoveUserPopUpComponent } from '../show-remove-user-pop-up/show-remove-user-pop-up.component'

@Component({
  selector: 'app-interface-admin',
  templateUrl: './interface-admin.component.html',
  styleUrls: ['./interface-admin.component.css']
})
export class InterfaceAdminComponent {

  constructor(private router: Router,private http: HttpClient,private dialog: MatDialog){}
  currentUserString = localStorage.getItem('currentUser');
  datasource: User[] = []
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email'];

  async ngOnInit() {
    if(!this.currentUserString){
      this.router.navigate(['/'])
    }
    
  }

  toggleDropdown(room:any) {
    room.isDropdownOpen = !room.isDropdownOpen;
    this.rooms.forEach(singleRoom => {
      if(room!=singleRoom){
        singleRoom.isDropdownOpen=false
      }
    });
  }
  showUsers: boolean = false;
  showRooms: boolean = false;
  showCreateRoom : boolean = false;
  users: User[] = [];
  rooms: Room[] = [];
  newRoomName: string = '';
  RoomsInfo =[]
  async RefreshToken(){
    const test = localStorage.getItem('currentUser')
    try{
      if(test){const { refresh,name } = JSON.parse(test) as { refresh: string,name:string };
    const tokenUrll ='http://'+window.location.hostname+':8080/realms/myreal/protocol/openid-connect/token'
    const tokenHeaderss = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const tokenBody = new URLSearchParams();
    tokenBody.set('grant_type', 'refresh_token');
    tokenBody.set('client_id', 'angular-id');
    tokenBody.set('refresh_token', refresh);
    tokenBody.set('client_secret', 'ZPI7KVeI23AymvZ4aU0FXSa2vX5oG5gJ');
    
    const tokenResponsee: any = await this.http.post(tokenUrll, tokenBody.toString(), { headers: tokenHeaderss }).toPromise();
    
    const accessToken=tokenResponsee?.access_token;
    const refresh_token=tokenResponsee?.refresh_token;
    localStorage.setItem('currentUser', JSON.stringify({ name: name,token: accessToken,refresh: refresh_token }));
    }
    }
    catch(error:any){
      localStorage.removeItem('currentUser')
      this.router.navigate(['/'])
    }
  }
  async getResponse(path:any){
    let retry=true
    while(retry){
      try{
        const test = localStorage.getItem('currentUser')
        
        if(test){
        const { token,name } = JSON.parse(test) as { token: string ,name:string};
        const tokenUrl = path ;
        const tokenHeaders = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer '+token
        });
        const tokenResponse: any = await this.http.get(tokenUrl, { headers: tokenHeaders }).toPromise();
        retry=false
        return tokenResponse;
      }
      }catch{
        this.RefreshToken()
        retry=true
      }
    }
      
  }
  async getUsers() {
    this.users=[]
    const tokenUrl = 'http://'+window.location.hostname+':8080/admin/realms/myreal/users/';
    const userResponse: any = await this.getResponse(tokenUrl)
    userResponse.forEach((user:any) =>{
        let currentUser :User = {
          id : user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };
        this.users.push(currentUser)
    })
    this.datasource =this.users;
    console.log(this.users)
    
    this.showUsers = true;
    this.showRooms = false;
    this.showCreateRoom = false
  }

  async getRooms() {
    // Simulated room data
    this.rooms=[]
    const tokenUrl = 'http://'+window.location.hostname+':8080/admin/realms/myreal/groups/';
    const userResponse: any = await this.getResponse(tokenUrl)
    await Promise.all(userResponse.map(async (room: any) =>{
      const Url = 'http://localhost:8080/admin/realms/myreal/groups/'+room.id+'/members'
      const Reponse: any = await this.getResponse(Url)
      let currentUser :Room = {
        Name: room.name,
        Count: Reponse.length,
        isDropdownOpen:false,
        id : room.id
      };
      this.rooms.push(currentUser)
  }))
    this.showUsers = false;
    this.showRooms = true;
    this.showCreateRoom = false;
    
  }
  removeRoom(Room:any){
    this.rooms.forEach(async(signleRoom:any) => {
      if(Room.name==signleRoom.name){
       const url = 'http://localhost:8080/admin/realms/myreal/groups/'+Room.id
       const test = localStorage.getItem('currentUser')
       if(test){
        const { token } = JSON.parse(test) as { token: string};
        const tokenHeaderss = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        });
        const tokenResponsee: any = await this.http.delete(url, { headers: tokenHeaderss }).toPromise();
        this.getRooms()
       }

      }
    });

  }
  showCreateRoomForm() {
    this.showUsers = false;
    this.showRooms = false;
    this.showCreateRoom = true
    this.newRoomName = '';
  }

  async createRoom() {
    // Get the room name from the input field
    let retry = true
    while(retry){
      try{
        const test = localStorage.getItem('currentUser')
        
        if(test){
          const newRoom = document.getElementById("name");
          const { token } = JSON.parse(test) as { token: string};
      if (newRoom instanceof HTMLInputElement) {
        const roomName = newRoom.value;
        const tokenUrll ='http://'+window.location.hostname+':8080/admin/realms/myreal/groups'
        const tokenHeaderss = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        });
        const tokenResponsee: any = await this.http.post(tokenUrll,{"name": roomName,"path": '/'+roomName,"subGroups": []}, { headers: tokenHeaderss }).toPromise();
        alert('Room '+roomName+' Created')
        retry = false
      }
        }
      }catch{
        this.RefreshToken()
        retry = true
      }
    }
    

    
  }
  showPopUpUsers(room:any){
    this.dialog.open(ShowUsersPopUpComponent,{data:room})
  }
  showPopUpRemoveUser(room:any){
    this.dialog.open(ShowRemoveUserPopUpComponent,{data:room})
  }

}
interface User {
  id : number
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}


interface Room {
  Name: string;
  Count: string;
  id : Number
  isDropdownOpen: boolean
}
