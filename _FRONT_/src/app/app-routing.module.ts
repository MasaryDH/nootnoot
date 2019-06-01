import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { ChatComponent } from './chat/chat.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },    // app navigates automatically to home
  { path: 'home', component: HomeComponent },
  { path: 'registreren', component: RegisterComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] }, //chat route protected
  { path: 'paswoord-reset', component: PasswordResetComponent },
  { path: '**', redirectTo: '/home' },    // app navigates automatically to home if user visits invalid url
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
