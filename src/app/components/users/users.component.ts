import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users;
  sortedbyName = false;
  sortedbyEmail = false;
  sortedbyStatus = false;
  sortedbyOrg = false;

  constructor(private us: UserService,
              private as: AuthService,
              private fms: FlashMessagesService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.us.getAllUsers()
      .subscribe(data => {
        this.users = data;
        console.log(this.users);
      });
  }

  sort(type) {
    if (type === 'Name' && !this.sortedbyName) {
      this.users = this.users.sort((a, b) => a.Name > b.Name ? 1 : -1);
      this.sortedbyName = true;
      return;
    }
    if (type === 'Name' && this.sortedbyName) {
      this.users = this.users.sort((a, b) => a.Name > b.Name ? -1 : 1);
      this.sortedbyName = false;
      return;
    }
    if (type === 'Email' && !this.sortedbyEmail) {
      this.users = this.users.sort((a, b) => a.Email > b.Email ? 1 : -1);
      this.sortedbyEmail = true;
      return;
    }
    if (type === 'Email' && this.sortedbyEmail) {
      this.users = this.users.sort((a, b) => a.Email > b.Email ? -1 : 1);
      this.sortedbyEmail = false;
      return;
    }
    if (type === 'Org' && !this.sortedbyOrg) {
      this.users = this.users.sort((a, b) => a.Org > b.Org ? 1 : -1);
      this.sortedbyOrg = true;
      return;
    }
    if (type === 'Org' && this.sortedbyOrg) {
      this.users = this.users.sort((a, b) => a.Org > b.Org ? -1 : 1);
      this.sortedbyOrg = false;
      return;
    }
    if (type === 'Status' && !this.sortedbyStatus) {
      const temp1 = this.users.filter(x => x.Confirmed === true);
      const temp2 = this.users.filter(x => x.Confirmed === false);
      this.users.length = 0;
      this.users = this.users.concat(temp1);
      this.users = this.users.concat(temp2);
      this.sortedbyStatus = true;
      return;
    }
    if (type === 'Status' && this.sortedbyStatus) {
      const temp1 = this.users.filter(x => x.Confirmed === true);
      const temp2 = this.users.filter(x => x.Confirmed === false);
      this.users.length = 0;
      this.users = this.users.concat(temp2);
      this.users = this.users.concat(temp1);
      this.sortedbyStatus = false;
      return;
    }
  }

  approveUser(unConfirmedUser) {
    unConfirmedUser.Confirmed = true;
    this.us.approveUser(unConfirmedUser.id, unConfirmedUser)
      .then(() => {
        this.fms.show(' לקוח ' + unConfirmedUser.Name + ' מארגון ' + unConfirmedUser.Org + ' אושר בהצלחה ', {
          cssClass: 'success',
          timeout: 5000
        });
      });
  }

  async deleteUser(unConfirmedUser) {
    await this.us.deleteUser(unConfirmedUser.id);
    await this.as.deleteUser();
    this.fms.show(' לקוח ' + unConfirmedUser.Name + ' מארגון ' + unConfirmedUser.Org + ' נמחק ', {
      cssClass: 'success',
      timeout: 5000
    });
  }

}
