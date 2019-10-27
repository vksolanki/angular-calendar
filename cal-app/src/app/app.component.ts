import { Component } from '@angular/core';
declare var Oidc: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cal-app';
  log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
      if (msg instanceof Error) {
        msg = "Error: " + msg.message;
      }
      else if (typeof msg !== 'string') {
        msg = JSON.stringify(msg, null, 2);
      }
      document.getElementById('results').innerHTML += msg + '\r\n';
    });
  }
  mgr: any;
  constructor() {
    let config = {
      authority: "http://localhost:5000",
      client_id: "js",
      redirect_uri: "http://localhost:5003/idscallback",
      response_type: "code",
      scope: "openid profile api1",
      post_logout_redirect_uri: "http://localhost:5003/home",
    };
    this.mgr = new Oidc.UserManager(config);

    this.mgr.getUser().then((user) => {
      if (user) {
        console.log("User logged in", user.profile);
      }
      else {
        console.log("User not logged in");
      }
    });

    this.selectedDate = new Date(2018,8,11);
  }
  selectedDate: Date;
  login() {
    this.mgr.signinRedirect();
  }

  api() {
    this.mgr.getUser().then(function (user) {
      var url = "http://localhost:5000/identity";
      let thiscontext = this;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function () {
        thiscontext.log(xhr.status, JSON.parse(xhr.responseText));
      }
      xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
      xhr.send();
    });
  }

  logout() {
    this.mgr.signoutRedirect();
  }

  onDateSelected(date) {
    console.log(date);
  }
}
