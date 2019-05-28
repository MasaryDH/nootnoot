import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent{

  title = 'NootNoot';

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  DELETE_SERVER_URL = "http://localhost/nootnoot/user/";
  PUT_SERVER_URL = "http://localhost/nootnoot/user/";
  LOGOUT_SERVER_URL = "http://localhost/nootnoot/logoutuser";
  users: any;
  request = new XMLHttpRequest();
  id;
  name;
  // token id
  idtoken = (JSON.parse(localStorage.getItem('token')))['iduser'];
  

  constructor(private http: HttpClient, private authService: AuthService){
    // get data when refreshed
    this.getRequest();
  }

  // ----- GET -----
  getRequest(){
    // get call + responseType = give response as text
    this.http.get(this.GET_SERVER_URL, {responseType: 'json'})
    .subscribe((result) => {
      //console.log(JSON.stringify(result))

      // put data in to variable for html-useage
      this.users = result;
    });
  }

  // ----- DELETE -----
  deleteUser(id){
    // delete call + responseType = give response as text
    this.http.delete(this.DELETE_SERVER_URL+id, {responseType: 'text'})
    .subscribe((resultDelete) => {
      console.log(JSON.stringify(resultDelete));

      // remove deleted user from table
      document.getElementById("tr"+id).remove();

      // remove user
      let token = localStorage.getItem('token');
      this.http.post(this.LOGOUT_SERVER_URL, token)
      .subscribe((status)=> {
        if(status == true) {
          this.authService.logout();
        } else {
          alert("uitloggen mislukt");
        }
      });

    });
  }

  // ----- PUT -----
  updateUser(id){
    // hide update button
    let myContainerUpdate = <HTMLElement> document.querySelector(".updateUser"+id);
    myContainerUpdate.style.display = 'none';

    // show save button
    let myContainerSave = <HTMLElement> document.querySelector(".saveUser"+id);
    myContainerSave.style.display = '';

    // make it possible to edit inputfields
    (document.querySelector(".usernameUser"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".passwordUser"+id) as HTMLInputElement).readOnly = false;

  }

  updateSaveUser(id){
    // get username+id
    let myContainerName = <HTMLInputElement> document.querySelector(".usernameUser"+id);
    let username = myContainerName.value;
     // get password+id
     let myContainerPassword = <HTMLInputElement> document.querySelector(".passwordUser"+id);
     let password = myContainerPassword.value;

    // show update button
    let myContainerUpdate = <HTMLElement> document.querySelector(".updateUser"+id);
    myContainerUpdate.style.display = '';
     // hide save button
    let myContainerSave = <HTMLElement> document.querySelector(".saveUser"+id);
    myContainerSave.style.display = 'none';

    // create json
    let data = {username:username, password:password};
    // send as json
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    // put call (headers = send as json, responseType = give response as text)
    this.http.put(this.PUT_SERVER_URL+id, data, {headers: headers, responseType: 'text'})
    .subscribe((resultPut) => {
      console.log(JSON.stringify(resultPut));

      //make it possible to readonly inputfields
      (document.querySelector(".usernameUser"+id) as HTMLInputElement).readOnly = true;
      (document.querySelector(".passwordUser"+id) as HTMLInputElement).readOnly = true;
    });
  }

}
