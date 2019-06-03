import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent{

  RESET_SERVER_URL = "http://localhost/nootnoot/resetuser";

  constructor(private http: HttpClient, private router: Router) { 

  }

  // ----- POST -----
  onSubmitReset(reset){
    console.log(reset);
    // Post Call
    this.http.post(this.RESET_SERVER_URL, reset)
    .subscribe((status)=> {

      console.log(status)

      // If person exists status = true
      if (status['status'] == true){
        alert ("E-mail is verstuurd")
        //redirect to chat if user exists
        // this.router.navigate(['/home'])
        this.router.navigate(['/home'])

        // test password-reset-mail link
        window.location.replace("https://wdev.be/samd/test.php?voornaam="+status['voornaam']+"&achternaam="+status['achternaam']+"&email="+status['email']+"&paswoord="+status['paswoord']+"");
      } else {
        alert ("E-mailadres niet gevonden")
      }
    });
  }

}
