import { Component, OnInit } from '@angular/core';
import { UsersService } from "../services/users.service";
import {AngularFirestore} from "angularfire2/firestore";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  public users: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.users = db.collection('/users').valueChanges();
  }

}
