import { Component, OnInit } from '@angular/core';
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
      // console.log(JSON.stringify(result));
      this.users = result;
    });
  }

  //mobile keyboard fix
  ngOnInit(){
    setTimeout(function () {
      let viewheight = window.innerHeight;
      let viewwidth = window.innerWidth;
      let viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0");
    }, 300);
  }
    
}
