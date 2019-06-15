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

  // // ----- DELETE -----
  // deleteRequest(id){
  //   // delete call + responseType = give response as text
  //   this.http.delete(this.DELETE_SERVER_URL+id, {responseType: 'text'})
  //   .subscribe((resultDelete) => {
  //     console.log(JSON.stringify(resultDelete));

  //     alert('Gebruiker '+id+' verijwdert');

  //     // remove deleted user from table
  //     document.getElementById("tr"+id).remove();
  //   });
  // }

  //token
  token = localStorage.getItem('token');
  //token id
  idtoken = (JSON.parse(localStorage.getItem('token')))['iduser'];
  //token email
  emailtoken = (JSON.parse(localStorage.getItem('token')))['user_email'];

// ----- DELETE -----
  deleteRequest(id){
    let data = {iduser:id, user_email:this.emailtoken};
    // delete call 
    this.http.post(this.DELETE_SERVER_URL+id, data)
    .subscribe((resultDelete) => {
      console.log(JSON.stringify(resultDelete));

      alert('Gebruiker '+ id +' verwijdert');

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
    (document.querySelector(".email"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".firstname"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".lastname"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".password"+id) as HTMLInputElement).readOnly = false;
    (document.querySelector(".passwordCheck"+id) as HTMLInputElement).readOnly = false;

    //make edit inputfields glowup
    (document.querySelector(".username"+id) as HTMLInputElement).classList.add("editInput");
    (document.querySelector(".email"+id) as HTMLInputElement).classList.add("editInput");
    (document.querySelector(".firstname"+id) as HTMLInputElement).classList.add("editInput");
    (document.querySelector(".lastname"+id) as HTMLInputElement).classList.add("editInput");
    (document.querySelector(".password"+id) as HTMLInputElement).classList.add("editInput");
    (document.querySelector(".passwordCheck"+id) as HTMLInputElement).classList.add("editInput");
  }

  updateSave(id){
    // get username+id
    let myContainerName = <HTMLInputElement> document.querySelector(".username"+id);
    let username = myContainerName.value;
    // get email+id
    let myContainerEmail = <HTMLInputElement> document.querySelector(".email"+id);
    let email = myContainerEmail.value;
    // get firstname+id
    let myContainerFirstname = <HTMLInputElement> document.querySelector(".firstname"+id);
    let firstname = myContainerFirstname.value;
    // get lastname+id
    let myContainerLastname = <HTMLInputElement> document.querySelector(".lastname"+id);
    let lastname = myContainerLastname.value;
    // get password+id
    let myContainerPassword = <HTMLInputElement> document.querySelector(".password"+id);
    let password = myContainerPassword.value;
    // get password+id
    let myContainerPasswordCheck = <HTMLInputElement> document.querySelector(".passwordCheck"+id);
    let passwordCheck = myContainerPasswordCheck.value;

    if(password == passwordCheck){
      // show update button
      let myContainerUpdate = <HTMLElement> document.querySelector(".update"+id);
      myContainerUpdate.style.display = '';
      // hide save button
      let myContainerSave = <HTMLElement> document.querySelector(".save"+id);
      myContainerSave.style.display = 'none';

      // create json
      let data = { username:username, user_email:email, user_firstname:firstname, user_lastname:lastname, user_password:password };
      // send as json
      let headers = new HttpHeaders({'Content-Type': 'application/json'});

      // put call (headers = send as json, responseType = give response as text)
      this.http.put(this.PUT_SERVER_URL+id, data, {headers: headers, responseType: 'text'})
        .subscribe((resultPut) => {
        //console.log(JSON.stringify(resultPut));

        alert("Gebruiker "+ id +" geüpdatet");

        //make it possible to readonly inputfields
        (document.querySelector(".username"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".email"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".firstname"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".lastname"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".password"+id) as HTMLInputElement).readOnly = true;
        (document.querySelector(".passwordCheck"+id) as HTMLInputElement).readOnly = true;

        //make edit inputfields not glowup anymore
        (document.querySelector(".username"+id) as HTMLInputElement).classList.remove("editInput");
        (document.querySelector(".email"+id) as HTMLInputElement).classList.remove("editInput");
        (document.querySelector(".firstname"+id) as HTMLInputElement).classList.remove("editInput");
        (document.querySelector(".lastname"+id) as HTMLInputElement).classList.remove("editInput");
        (document.querySelector(".password"+id) as HTMLInputElement).classList.remove("editInput");
        (document.querySelector(".passwordCheck"+id) as HTMLInputElement).classList.remove("editInput");
      });
    } else {
      alert("Paswoord komt niet overeen");
    }
  }

  openData(id){
    let elem = document.getElementById('userData'+id);
    let open = elem.style.display == "block";

    // change arrow
    let arrow = document.getElementById('arrow'+id);
    arrow.innerHTML = '&#9662;'; 
    if (open) {
        elem.style.display="none";
        arrow.innerHTML = '&#9656;';
   } 
   else {
      elem.style.display="block";
      arrow.innerHTML = '&#9662;'; 
   }
  }

}
