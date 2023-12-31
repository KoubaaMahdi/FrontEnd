import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-show-users-pop-up',
  templateUrl: './show-users-pop-up.component.html',
  styleUrls: ['./show-users-pop-up.component.css'],
})
export class ShowUsersPopUpComponent {
  constructor(private router: Router,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: Room){}
  hasMembers : boolean = false
  noMembers : boolean = false
  users: User[] = [];
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email'];
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
    localStorage.setItem('adminUser', JSON.stringify({ name: name,token: accessToken,refresh: refresh_token }));
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
        const { token } = JSON.parse(test) as { token: string };
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
        this.users.push(currentUser)
    })
    if(userResponse.length>0){
      this.hasMembers=true
      this.noMembers = false
    }else{
      this.hasMembers=false
      this.noMembers = true
    }
    this.pageSlice = this.users.slice(0,4)
  
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