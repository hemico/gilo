import { Injectable } from '@angular/core';
import { Http } from '@angular/http'; //Fire Base
import { AngularFireDatabase } from 'angularfire2/database';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  http:Http;
  constructor(http:Http, private db:AngularFireDatabase) {
    this.http = http;
  }

}
