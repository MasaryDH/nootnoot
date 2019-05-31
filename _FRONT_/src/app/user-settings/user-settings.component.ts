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
  selectedFile = null;

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
    (document.querySelector(".emailUser"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".firstnameUser"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".lastnameUser"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".passwordUser"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".passwordCheckUser"+id) as HTMLInputElement).readOnly = false;

  }

  updateSaveUser(id){
    // get username+id
    let myContainerName = <HTMLInputElement> document.querySelector(".usernameUser"+id);
    let username = myContainerName.value;
    // get email+id
    let myContainerEmail = <HTMLInputElement> document.querySelector(".emailUser"+id);
    let email = myContainerEmail.value;
    // get firstname+id
    let myContainerFirstname = <HTMLInputElement> document.querySelector(".firstnameUser"+id);
    let firstname = myContainerFirstname.value;
    // get lastname+id
    let myContainerLastname = <HTMLInputElement> document.querySelector(".lastnameUser"+id);
    let lastname = myContainerLastname.value;
    // get password+id
    let myContainerPassword = <HTMLInputElement> document.querySelector(".passwordUser"+id);
    let password = myContainerPassword.value;
    // get password+id
    let myContainerPasswordCheck = <HTMLInputElement> document.querySelector(".passwordCheckUser"+id);
    let passwordCheck = myContainerPasswordCheck.value;

    if(password == passwordCheck){
      // show update button
      let myContainerUpdate = <HTMLElement> document.querySelector(".updateUser"+id);
      myContainerUpdate.style.display = '';
      // hide save button
      let myContainerSave = <HTMLElement> document.querySelector(".saveUser"+id);
      myContainerSave.style.display = 'none';

      // create json
      let data = { username:username, user_email:email, user_firstname:firstname, user_lastname:lastname, user_password:password };
      // send as json
      let headers = new HttpHeaders({'Content-Type': 'application/json'});

      // put call (headers = send as json, responseType = give response as text)
      this.http.put(this.PUT_SERVER_URL+id, data, {headers: headers, responseType: 'text'})
        .subscribe((resultPut) => {
        console.log(JSON.stringify(resultPut));

        //make it possible to readonly inputfields
        (document.querySelector(".usernameUser"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".emailUser"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".firstnameUser"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".lastnameUser"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".passwordUser"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".passwordCheckUser"+id) as HTMLInputElement).readOnly = true;
      });
    } else {
      alert("Paswoord komt niet overeen");
    }
  }

  imgUpload(event){
    console.log(event);
    this.selectedFile = event.target.files[0];

    
    let reader = new FileReader();

    reader.readAsDataURL(this.selectedFile);

    const img = new FormData();
    img.append('image', this.selectedFile, this.selectedFile.name);

    this.http.post('http://localhost/nootnoot/imgupload', img)
    .subscribe((result) => {
      console.log(result);
    });
  }
}
