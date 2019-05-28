import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  title = 'NootNoot';

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  DELETE_SERVER_URL = "http://localhost/nootnoot/user/";
  PUT_SERVER_URL = "http://localhost/nootnoot/user/";
  users: any;
  request = new XMLHttpRequest();
  id;
  name;
  

  constructor(private http: HttpClient){
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
  deleteRequest(id){
    // delete call + responseType = give response as text
    this.http.delete(this.DELETE_SERVER_URL+id, {responseType: 'text'})
    .subscribe((resultDelete) => {
      console.log(JSON.stringify(resultDelete));

      // remove deleted user from table
      document.getElementById("tr"+id).remove();
    });
  }

  // ----- PUT -----
  updateRequest(id){
    // hide update button
    let myContainerUpdate = <HTMLElement> document.querySelector(".update"+id);
    myContainerUpdate.style.display = 'none';

    // show save button
    let myContainerSave = <HTMLElement> document.querySelector(".save"+id);
    myContainerSave.style.display = '';

    // make it possible to edit inputfields
    (document.querySelector(".username"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".password"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".status"+id) as HTMLInputElement).readOnly = false;

  }

  updateSave(id){
    // get username+id
    let myContainerName = <HTMLInputElement> document.querySelector(".username"+id);
    let username = myContainerName.value;
     // get password+id
     let myContainerPassword = <HTMLInputElement> document.querySelector(".password"+id);
     let password = myContainerPassword.value;

    // show update button
    let myContainerUpdate = <HTMLElement> document.querySelector(".update"+id);
    myContainerUpdate.style.display = '';
     // hide save button
    let myContainerSave = <HTMLElement> document.querySelector(".save"+id);
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
      (document.querySelector(".username"+id) as HTMLInputElement).readOnly = true;
      (document.querySelector(".password"+id) as HTMLInputElement).readOnly = true;
    });
  }

}
