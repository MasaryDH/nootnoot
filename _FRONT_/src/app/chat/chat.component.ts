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
  PUTSTATUS_SERVER_URL = "http://localhost/nootnoot/userstatus/";
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

    //check browser tab is active -> status absent
    this.checkIsActive();
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
       let elem = document.getElementById("tableOffline");
       let hide = elem.style.display =="none";

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

  //Mobile status table
  openStatusTable(){
    let elem = document.getElementById("status");
    let icon = document.getElementById("icon");
    let show = elem.style.display =="block";

    if(show){
      elem.style.display = "none";
      icon.style.color = '#000';
      icon.className = "far fa-user-circle";
    } else {
      elem.style.display = "block";
      icon.style.color = '#999';
      icon.className = "fas fa-user-circle";
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
        alert("Uitloggen mislukt");
      }
    });
  }

  //Put yourself on absent
  statusIdle(id){
    let status = { status_idstatus:2 };
    this.http.put(this.PUTSTATUS_SERVER_URL+id, status)
    .subscribe((result) => {
      if(result == true){
        alert("Je bent nu afwezig");
        //change icon to idle
        let statusOnline = document.getElementById("Online"+id);
        statusOnline.style.display = "none";
        let statusIdle = document.getElementById("Idle"+id);
        statusIdle.style.display = "block";
      }else{
        alert("Er is iets misgelopen bij het afwezig zetten");
      }
    });
  }

  //Put yourself back to online
  statusOnline(id){
    let status = { status_idstatus:1 };
    this.http.put(this.PUTSTATUS_SERVER_URL+id, status)
    .subscribe((result) => {
      if(result == true){
        alert("Je bent nu online");
        //change icon to online
        let statusOnline = document.getElementById("Online"+id);
        statusOnline.style.display = "block";
        let statusIdle = document.getElementById("Idle"+id);
        statusIdle.style.display = "none";
      }else{
        alert("Er is iets misgelopen bij het online zetten");
      }
    });
  }

  //Status absent if browser tab is inactive
  checkIsActive() {
    this.interval = setInterval(() => {
      if(!document.hidden){
        let status = { status_idstatus: 1 };
        this.http.put(this.PUTSTATUS_SERVER_URL+this.idtoken, status)
        .subscribe();
      } else {
        let status = { status_idstatus: 2 };
        this.http.put(this.PUTSTATUS_SERVER_URL+this.idtoken, status)
        .subscribe();
      }
    }, 1000);
  }

  //Modals
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
