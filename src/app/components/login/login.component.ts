  import { Component } from '@angular/core';
  import { KeycloakService } from 'keycloak-angular';
  import { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';
  import { Router } from '@angular/router';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';



  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  })
  export class LoginComponent {
    keycloakLoginOptions: KeycloakLoginOptions = {
      redirectUri: 'http://localhost:4200/chat'
    }
    usernameObject = document.getElementById('username')as HTMLInputElement | null;
    passwordObject = document.getElementById('password')as HTMLInputElement | null;
    username =this.usernameObject?.value || '';
    password =this.passwordObject?.value || '';
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
      this.keycloak.login(this.keycloakLoginOptions)
      
    }

    public logout() {
      this.keycloak.logout();
    }
    async checkIfClientExists(): Promise<boolean> {
      try {
        // Obtain an access token using the provided username and password
        const tokenResponse = await axios.post(
          'http://localhost:8080/realms/myreal/protocol/openid-connect/token',
          new URLSearchParams({
            grant_type: 'password',
            client_id: 'angular-id',
            username: 'lahbib',
            password: 'lahbib',
            client_secret : 'EcNkQPWAHzXiTvQPWJy7RBhanNUyGXwh'

          }),
          {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              
            },
          }
        );
    
        const accessToken = tokenResponse.data.access_token;
    
        // Make a GET request to the clients endpoint using the obtained access token
        const clientsResponse = await axios.get(
          'http://localhost:8080/admin/myreal/clientsclientId=angular-id',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    
        // Check if the response contains any clients
        return clientsResponse.data.length > 0;
      } catch (error) {
        // Handle any errors that occur during the API request
        console.error('Error checking client existence:', error);
        return false;
      }
    }
    

    
  }
