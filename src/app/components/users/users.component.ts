import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

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
  constructor(
    private us: UserService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.us.getAllUsers()
    .subscribe( data => {
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
      const temp1 = this.users.filter( x => x.Confirmed === true );
      const temp2 = this.users.filter( x => x.Confirmed === false );
      this.users.length = 0;
      this.users = this.users.concat(temp1);
      this.users = this.users.concat(temp2);
      this.sortedbyStatus = true;
      return;
    }
    if (type === 'Status' && this.sortedbyStatus) {
      const temp1 = this.users.filter( x => x.Confirmed === true );
      const temp2 = this.users.filter( x => x.Confirmed === false );
      this.users.length = 0;
      this.users = this.users.concat(temp2);
      this.users = this.users.concat(temp1);
      this.sortedbyStatus = false;
      return;
    }
    
  }

}
