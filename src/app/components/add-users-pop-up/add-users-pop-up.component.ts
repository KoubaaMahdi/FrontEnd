import { Component , Inject , ViewChild ,ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-add-users-pop-up',
  templateUrl: './add-users-pop-up.component.html',
  styleUrls: ['./add-users-pop-up.component.css']
})
export class AddUsersPopUpComponent {

  constructor(private router: Router,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: Room,private changeDetectorRefs: ChangeDetectorRef){}
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  hasMembers : boolean = false
  noMembers : boolean = false
  users: User[] = [];
  usersToRemove : User[] = [];
  usersAll : User[] = [];
  selection = new SelectionModel<User>(true, []);
  pageSlice : User []=[]
  ngOnInit(){
    this.getUsers()

  }
  onPageChange(event:PageEvent){
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex+event.pageSize;
    if(endIndex>this.users.length){
      endIndex=this.users.length
    }
    this.pageSlice = this.users.slice(startIndex,endIndex)
    
  }
  async RefreshToken(){
    const test = localStorage.getItem('adminUser')
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
      localStorage.removeItem('adminUser')
      this.router.navigate(['/'])
    }
  }
  async getResponse(path:any){
    let retry=true
    while(retry){
      try{
        const test = localStorage.getItem('adminUser')
        
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
    this.usersAll = []
    try{
      const tokenUrl = 'http://'+window.location.hostname+':8080/admin/realms/myreal/groups/'+this.data.id+'/members';
      const userResponse: any = await this.getResponse(tokenUrl)
      userResponse.forEach((user:any) =>{
          let currentUser :User = {
            id : user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          };
          this.usersAll.push(currentUser)
      })
      this.usersToRemove=[]
      const tokenUrll = 'http://'+window.location.hostname+':8080/admin/realms/myreal/users/';
      const userResponses: any = await this.getResponse(tokenUrll)
      userResponses.forEach((user:any) =>{
          let currentUser :User = {
            id : user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          };
          this.usersToRemove.push(currentUser)
      })
    }catch{
      this.RefreshToken()
    }
    this.users = this.usersToRemove.filter(user => !this.usersAll.some(u => u.id === user.id));
    this.pageSlice = this.users.slice(0,4)
    
    if(this.users.length>0){
      this.hasMembers=true
      this.noMembers = false
    }else{
      this.hasMembers=false
      this.noMembers = true
    }
}

addUser() {
  const test = localStorage.getItem('adminUser');
  const promises = this.selection.selected.map(async (element: any) => {
    const Urladd = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/' + element.id + '/groups/' + this.data.id;
    try {
      if (test) {
        const { token } = JSON.parse(test) as { token: string };
        const tokenHeaders = new HttpHeaders({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        });
        const tokenResponse: any = await this.http.put(Urladd, null, { headers: tokenHeaders }).toPromise();
        console.log("1");
      }
    } catch {
      this.RefreshToken();
    }
  });

  Promise.all(promises)
    .then(() => {
      console.log("2")
      this.selection.clear();
      this.getUsers();
    })
    .catch((error) => {
      // Handle error if necessary
    });
}

displayedColumns: string[] = ['select','username', 'firstName', 'lastName', 'email'];
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.pageSlice.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.pageSlice.forEach(row => this.selection.select(row));
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
