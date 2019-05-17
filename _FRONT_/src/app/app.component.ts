import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NootNoot';

  GET_SERVER_URL = "http://localhost/nootnoot/users";
  users: any;

  constructor(private http: HttpClient){
    this.getRequest();
  }

  getRequest(){
    this.http.get(this.GET_SERVER_URL).subscribe((result) => {
      console.log(JSON.stringify(result));
      this.users = result;
    });
    
  }

}
