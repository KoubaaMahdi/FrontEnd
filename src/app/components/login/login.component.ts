  import { Component } from '@angular/core';
  import { KeycloakService } from 'keycloak-angular';
  import { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';
  import { Router } from '@angular/router';
  import { HttpClient, HttpHeaders } from '@angular/common/http';




  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    tokenUrl = 'http://localhost:8080/realms/myreal/protocol/openid-connect/token';
    tokenHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    tokenBody = new URLSearchParams();
    keycloakLoginOptions: KeycloakLoginOptions = {
      redirectUri: 'http://localhost:4200/chat'
    }
    
    public isLoggedIn = false;
    public userProfile: KeycloakProfile | null = null;

    constructor(private readonly keycloak: KeycloakService,private router: Router,private http: HttpClient) {}
    public async ngOnInit() {
      
      this.isLoggedIn = await this.keycloak.isLoggedIn();

      if (this.isLoggedIn) {
        this.userProfile = await this.keycloak.loadUserProfile();
      }
    }

    public async login() {
      //this.checkIfClientExists()
      //this.keycloak.login(this.keycloakLoginOptions)
      
      
    }
    

    public logout() {
      this.keycloak.logout();
    }
  async checkIfClientExists() {
  
    // Obtain an access token using the provided username and password

    const usernameObject = document.getElementById('username')as HTMLInputElement | null;
    const passwordObject = document.getElementById('password')as HTMLInputElement | null;
    const username =usernameObject?.value || '';
    const password =passwordObject?.value || '';
    this.tokenBody.set('grant_type', 'password');
    this.tokenBody.set('client_id', 'angular-id');
    this.tokenBody.set('username', username);
    this.tokenBody.set('password', password);
    this.tokenBody.set('client_secret', 'EcNkQPWAHzXiTvQPWJy7RBhanNUyGXwh');
    const tokenResponse: any = await this.http.post(this.tokenUrl, this.tokenBody.toString(), { headers: this.tokenHeaders }).toPromise();
    
    const accessToken = tokenResponse?.access_token;
    console.log(accessToken)
    if (!accessToken) {
      throw new Error('Access token not received');
    }
    else{
      
      this.router.navigate(["/chat"])
    }
  }
  
}
