import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonComponent } from './components/person/person.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatRComponent } from './components/chat-r/chat-r.component';
import { SendComponent } from './components/send/send.component';
import { TextComponent } from './components/text/text.component';
import { SearchComponent } from './components/search/search.component';
import { StatusComponent } from './components/status/status.component';
import { ChatTextComponent } from './components/chat-text/chat-text.component';
import { ChatService } from './chat.service';
import { WebsocketService } from './websocket.service';
import { InterfaceComponent } from './components/interface/interface.component';
import { LoginComponent } from './components/login/login.component';
import { InterfaceAdminComponent } from './components/interface-admin/interface-admin.component';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ShowUsersPopUpComponent } from './components/show-users-pop-up/show-users-pop-up.component';
import { ShowRemoveUserPopUpComponent } from './components/show-remove-user-pop-up/show-remove-user-pop-up.component';
import { MatTableModule } from '@angular/material/table'  
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import { AddUsersPopUpComponent } from './components/add-users-pop-up/add-users-pop-up.component';
import {MatTabsModule} from '@angular/material/tabs'
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: "http://"+window.location.hostname+":8080",
        realm: 'myreal',
        clientId: 'angular-id'
      },
      initOptions: {
        onLoad: 'check-sso',
        
      }
      
    });
}
@NgModule({
  declarations: [
    AppComponent,
    PersonComponent,
    ChatComponent,
    ChatRComponent,
    SendComponent,
    TextComponent,
    SearchComponent,
    StatusComponent,
    ChatTextComponent,
    InterfaceComponent,
    LoginComponent,
    InterfaceAdminComponent,
    ShowUsersPopUpComponent,
    ShowRemoveUserPopUpComponent,
    AddUsersPopUpComponent,
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    PickerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule
    
  ],
  providers: [
    ChatService,
    WebsocketService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }