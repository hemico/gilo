import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WhoService } from '../../services/who.service';
import { Router } from '@angular/router';
// import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-navbar2',
  templateUrl: './navbar2.component.html',
  styleUrls: ['./navbar2.component.css'],
  //  providers: [MenuComponent],
})
export class Navbar2Component implements OnInit {

  userEmail;
  tempResult;
  userIsLoggedIn;
  userIsAdmin;
  userIsWorker;
  userIsGazbar;
  userIsClient;
  logo = './assets/Images/logo.jpg';

  constructor(
    private as: AuthService,
    private who: WhoService,
    private route: Router,
    //    private menu: MenuComponent,
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.as.getState()
      .subscribe(data => {
        if (data === null || data === undefined) {
          this.userIsLoggedIn = false;
          this.userEmail = null;
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = false;
        } else {
          this.userIsLoggedIn = true;
          this.userEmail = data.email;
          this.getAdmin();
        }
      });
  }

  getAdmin() {
    this.who.getAdmin()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = true;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = false;
          return;
        } else {
          this.getWorker();
        }
      });
  }
  getWorker() {
    this.who.getWorkers()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = true;
          this.userIsGazbar = false;
          this.userIsClient = false;
        } else {
          this.getGazbar();
        }
      });
  }
  getGazbar() {
    this.who.getAccountant()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = true;
          this.userIsClient = false;
        } else {
          this.getClient();
        }
      });
  }
  getClient() {
    this.who.getUsers()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = true;
        }
        console.log(this.tempResult);
      });
  }


  signOut() {
    this.userIsLoggedIn = false;
    this.userEmail = null;
      this.as.signOut();
      window.location.href = '/';
  }

}
