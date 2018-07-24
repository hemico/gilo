import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  password;
  email;
  errorMsg;
  user;
  isLoggedIn;

  constructor(
    private as: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    this.as.getState()
    .subscribe( data => {
      if ( data === null ) {
        this.isLoggedIn = false;
      } else {
        this.isLoggedIn = true;
        this.router.navigate(['/dashboard']);
      }
    });
  }

  Login() {
    this.as.Login(this.email , this.password)
    .then( data => {
      this.user = data;
      console.log(data);
      console.log(this.user.user.email);
    })
    .catch( err => {
      this.errorMsg = err;
      console.log(this.errorMsg.message);
    });
  }

  fblogin() {
    this.as.doFacebookLogin();
  }

  googlelogin() {
    this.as.doGoogleLogin();
  }

}
