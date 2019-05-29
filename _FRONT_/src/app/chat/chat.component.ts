import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent{

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  LOGOUT_SERVER_URL = "http://localhost/nootnoot/logoutuser";
  users: any;
  // token id
  idtoken = (JSON.parse(localStorage.getItem('token')))['iduser'];
  interval;
  test = 'true';

  constructor(private http: HttpClient, private authService: AuthService){
    // get data when refreshed
    this.getRequest();
    // if loggin in auto reload status-list
    if (this.test == 'true'){
    this.routerOnActivate();
    };
  }

  // ----- GET -----
  getRequest(){
    // get call + responseType = give response as text
    this.http.get(this.GET_SERVER_URL, {responseType: 'json'})
    .subscribe((result) => {
      //console.log(JSON.stringify(result))
      // put data in to variable for html-usage
      this.users = result;
    });
  }

  //Auto reload login list to check if someone new logged in
  routerOnActivate() {
    this.interval = setInterval(() => {
        this.getRequest()
    }, 10000);
  }

  // hide | show online table
  OnlineTable(){
       let elem = document.getElementById("tableOnline");
       let hide = elem.style.display =="none";

       // change arrow
       let arrow = document.getElementById('arrowOnline');
       arrow.innerHTML = '&#9656;';
       if (hide) {
           elem.style.display="block";
           arrow.innerHTML = '&#9662;';
      } 
      else {
         elem.style.display="none";
         arrow.innerHTML = '&#9656;';
      }
  }

  // hide | show offline table
  OfflineTable(){
       var elem = document.getElementById("tableOffline");
       var hide = elem.style.display =="none";

       // change arrow
       let arrow = document.getElementById('arrowOffline');
       arrow.innerHTML = '&#9656;';
       if (hide) {
           elem.style.display="block";
           arrow.innerHTML = '&#9662;';
      } 
      else {
         elem.style.display="none";
         arrow.innerHTML = '&#9656;';
      }
  }

  logout() {
    let token = localStorage.getItem('token');
    this.http.post(this.LOGOUT_SERVER_URL, token)
    .subscribe((status)=> {
      if(status == true) {
         // set auto reload status-list off
        this.test = 'false';
        clearInterval(this.interval);
        
        this.authService.logout();
      } else {
        alert("uitloggen mislukt");
      }
    });
  }

  openModalUsers(){
    let modal = document.getElementById("modalUsers");
    modal.style.display = "block";
  }

  closeModalUsers(){
    let modal = document.getElementById("modalUsers");
    modal.style.display = "none";
  }

  openModalUserSettings(){
    let modal = document.getElementById("modalUserSettings");
    modal.style.display = "block";
  }

  closeModalUserSettings(){
    let modal = document.getElementById("modalUserSettings");
    modal.style.display = "none";
  }
}
