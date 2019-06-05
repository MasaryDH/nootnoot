import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthGuard } from './guards/auth-guard.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ChatService } from './services/chat.service';
import { SocketService } from './services/socket.service';


@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    ChatComponent,
    PasswordResetComponent,
    UserSettingsComponent,
    ChatMessageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [AuthGuard, ChatService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
