import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WhoService } from '../../services/who.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  userIsLoggedIn = false;
  userIsAdmin = false;
  userIsClient = false;
  userIsWorker = false;
  userIsGazbar = false;
  tempResult;
  userEmail;

  constructor(
    private as: AuthService,
    private who: WhoService,
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.as.getState()
      .subscribe(data => {
        if (data !== null) {
          this.userIsLoggedIn = true;
          this.userEmail = data.email;
          this.getAdmin();
        } else {
          this.userIsLoggedIn = false;
          this.userEmail = null;
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = false;
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
      });
  }

}
