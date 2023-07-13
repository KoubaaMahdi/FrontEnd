import { Component , Inject , ViewChild ,ChangeDetectorRef} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-show-remove-user-pop-up',
  templateUrl: './show-remove-user-pop-up.component.html',
  styleUrls: ['./show-remove-user-pop-up.component.css'],
  
})

export class ShowRemoveUserPopUpComponent {
  public InterfaceAdminComponent :any
  constructor(private router: Router,private http: HttpClient,@Inject(MAT_DIALOG_DATA) public data: Room,private changeDetectorRefs: ChangeDetectorRef){
    
  }
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  hasMembers : boolean = false
  noMembers : boolean = false
  users: User[] = [];
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
    const tokenUrl = 'http://'+window.location.hostname+':8080/admin/realms/myreal/groups/'+this.data.id+'/members';
    const userResponse: any = await this.getResponse(tokenUrl)
    console.log(userResponse)
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
    if(this.users.length>4){
      this.pageSlice = this.users.slice(0,4)
    }else{
      
      this.pageSlice = this.users
    }


    if(userResponse.length>0){
      this.hasMembers=true
      this.noMembers = false
    }else{
      this.hasMembers=false
      this.noMembers = true
    }
    console.log(this.users)
}

removeUsers() {
  const test = localStorage.getItem('adminUser');
  const promises = this.selection.selected.map(async (element: any) => {
    const UrlRemove = 'http://' + window.location.hostname + ':8080/admin/realms/myreal/users/' + element.id + '/groups/' + this.data.id;
    if (test) {
      const { token } = JSON.parse(test) as { token: string };
      const tokenHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      });
      const tokenResponse: any = await this.http.delete(UrlRemove, { headers: tokenHeaders }).toPromise();
    }
  });

  Promise.all(promises)
    .then(() => {
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


