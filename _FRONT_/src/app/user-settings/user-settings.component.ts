import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  providers: [FormBuilder]
})

export class UserSettingsComponent {

  title = 'NootNoot';

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  DELETE_SERVER_URL = "http://localhost/nootnoot/user/";
  PUT_SERVER_URL = "http://localhost/nootnoot/user/";
  LOGOUT_SERVER_URL = "http://localhost/nootnoot/logoutuser";
  UPLOAD_SERVER_URL = "http://localhost/nootnoot/imgupload";
  IMAGE_SERVER_URL = "http://localhost/nootnoot/imgchange/";

  users;
  request = new XMLHttpRequest();
  id;
  name;
  selectedFile = null;
  pingu_profile_picture;

  // token id
  idtoken = (JSON.parse(localStorage.getItem('token')))['iduser'];

  pingu_profile_pic = [
    { key: "pingu", value:"Pingu" }, { key: "bril", value:"Nerdy-pingu" },
    { key: "strikje", value:"Fancy-pingu" }, { key: "clown", value:"Clown-pingu" },
    { key: "dany", value:"Daenerys-pingu" }, { key: "duivel", value:"Duivel-pingu" },
    { key: "engel", value:"Engel-pingu" }, { key: "frankenstein", value:"Frankenstein-pingu" },
    { key: "hippie", value:"Hippie-pingu" }, { key: "meisje", value:"Meisje-pingu" },
    { key: "jongen", value:"Jongen-pingu" }, { key: "kat", value:"Kat-pingu" },
    { key: "mario", value:"Mario-pingu" }, { key: "luigi", value:"Luigi-pingu" },
    { key: "marshmello", value:"Marshmello-pingu" }, { key: "negatief", value:"Negatief-pingu" }, 
    { key: "nightking", value:"Night King-pingu" }, { key: "pooh", value:"Winnie the Pooh-pingu" }, 
    { key: "punk", value:"Punk-pingu" }, { key: "shrek", value:"Shrek-pingu" }, 
    { key: "eenhoorn", value:"Eenhoorn-pingu" }, { key: "vampier", value:"Vampier-pingu" }, 
    { key: "zomer", value:"Zomer-pingu" }, { key: "harrypotter", value:"Harry Potter-pingu" },
  ]
  
  constructor(private http: HttpClient, private authService: AuthService, private fb: FormBuilder){
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
          alert("Uitloggen mislukt");
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

      // put call (headers = send as json, responseType = give response as text)
      this.http.put(this.PUT_SERVER_URL+id, data)
        .subscribe((resultPut) => {
        //console.log(JSON.stringify(resultPut));

        if(resultPut == true){
          //make it possible to readonly inputfields
          (document.querySelector(".usernameUser"+id) as HTMLInputElement).readOnly = true;
          (document.querySelector(".emailUser"+id) as HTMLInputElement).readOnly = true;
          (document.querySelector(".firstnameUser"+id) as HTMLInputElement).readOnly = true;
          (document.querySelector(".lastnameUser"+id) as HTMLInputElement).readOnly = true;
          (document.querySelector(".passwordUser"+id) as HTMLInputElement).readOnly = true;
          (document.querySelector(".passwordCheckUser"+id) as HTMLInputElement).readOnly = true;

          //clear password fields
          (document.querySelector(".passwordUser"+id) as HTMLInputElement).value = '';
          (document.querySelector(".passwordCheckUser"+id) as HTMLInputElement).value = '';

          alert('Account geüpdatet');
        } else {
          alert('Er is een probleem opgetreden bij het updaten');
        }
        
      });
    } else {
      alert("Paswoord komt niet overeen");
    }
  }

  pinguPicture(value, id){
    this.pingu_profile_picture = value + '.jpg';
    //change image
    document.querySelector("#profile_picture").setAttribute('src', 'assets/pingu_profile_pictures/'+this.pingu_profile_picture);

    let data = { user_profilepic:this.pingu_profile_picture }

    //update image in database
    this.http.put(this.IMAGE_SERVER_URL+id, data)
    .subscribe((result) => {
      if(result == true){
        alert('Profielfoto aangepast');
      } else {
        alert('Kan profielfoto niet aanpassen');
      }
      
    });
  }
}
