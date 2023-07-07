  import { Component } from '@angular/core';
  import { KeycloakService } from 'keycloak-angular';
  import { NgModule } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { ChatService } from '../../chat.service';

  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    isChecked: boolean = false;
    tokenUrl = 'http://'+window.location.hostname+':8080/realms/myreal/protocol/openid-connect/token';
    tokenHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    tokenBody = new URLSearchParams();
    public isLoggedIn = false;
    constructor(private readonly keycloak: KeycloakService,private router: Router,private http: HttpClient,private chat: ChatService) {}
    public async ngOnInit() {
      const test = localStorage.getItem('currentUser')
      const test2 = localStorage.getItem('adminUser')
        if(test){
          this.router.navigate(['/chat'])
        }
        if(test2){
          this.router.navigate(['/admin'])
        }

      
      
    }

    public async login() {
      this.checkIfClientExists();
      
      
      
    }
    
    onCheckboxChange(checked: Event) {
      const checkbox = checked.target as HTMLInputElement;
      this.isChecked = checkbox.checked
    
    }
    
  async checkIfClientExists() {
  
    // Obtain an access token using the provided username and password
    const block = document.getElementById("wrong") as HTMLInputElement;
    const usernameObject = document.getElementById('username')as HTMLInputElement | null;
    const passwordObject = document.getElementById('password')as HTMLInputElement | null;
    const username =usernameObject?.value || '';
    const password =passwordObject?.value || '';
    this.tokenBody.set('grant_type', 'password');
    this.tokenBody.set('client_id', 'angular-id');
    this.tokenBody.set('username', username);
    this.tokenBody.set('password', password);
    this.tokenBody.set('client_secret', 'ZPI7KVeI23AymvZ4aU0FXSa2vX5oG5gJ');
    try{
      const tokenResponse: any = await this.http.post(this.tokenUrl, this.tokenBody.toString(), { headers: this.tokenHeaders }).toPromise();

      const accessToken = tokenResponse?.access_token;
      const refreshToken = tokenResponse?.refresh_token;
    
    if (accessToken) {
      if(this.isChecked){
        
        localStorage.setItem('LoginCreds',JSON.stringify({ username: username,pass: password}))
      }
      if(username.toLowerCase()==='admin'){
        localStorage.setItem('adminUser', JSON.stringify({ name: username,token: accessToken,refresh: refreshToken }));
        this.router.navigate(["/admin"])
      }
      else{
        localStorage.setItem('currentUser', JSON.stringify({ name: username,token: accessToken,refresh: refreshToken }));
        this.router.navigate(["/chat"])
      }
      
      
    }
  }catch{
    block.setAttribute("class","error")
  }
    }
  
}
