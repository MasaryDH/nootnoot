import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},    // app navigates automatically to home
  { path: 'home', component: HomeComponent },
  { path: 'registreren', component: RegisterComponent },
  { path: 'gebruikers', component: UsersComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'paswoord-reset', component: PasswordResetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
