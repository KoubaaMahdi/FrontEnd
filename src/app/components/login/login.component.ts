  import { Component } from '@angular/core';
  import { KeycloakService } from 'keycloak-angular';
  import { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';
  import { Router } from '@angular/router';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { ChatService } from '../../chat.service';




  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    tokenUrl = 'http://'+window.location.hostname+':8080/realms/myreal/protocol/openid-connect/token';
    tokenHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    tokenBody = new URLSearchParams();
    /*keycloakLoginOptions: KeycloakLoginOptions = {
      redirectUri: 'http://172.16.0.195:4200/chat'
    }*/
    
    public isLoggedIn = false;
    //public userProfile: KeycloakProfile | null = null;

    constructor(private readonly keycloak: KeycloakService,private router: Router,private http: HttpClient,private chat: ChatService) {}
    public async ngOnInit() {
      const test = localStorage.getItem('currentUser')
      if(test){
        if(test){
          this.router.navigate(['/chat'])
        }
      }
      
    }

    public async login() {
      this.checkIfClientExists();
      
      //this.keycloak.login(this.keycloakLoginOptions)
      
      
    }
    

    /*public logout() {
      this.keycloak.logout();
    }*/
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
    
    if (!accessToken) {
      
    }
    else{
      localStorage.setItem('currentUser', JSON.stringify({ name: username,token: accessToken,refresh: refreshToken }));
      this.router.navigate(["/chat"])
      
    }
  }catch{
    block.setAttribute("class","error")
  }
    }
  
}
