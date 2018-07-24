import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class WhoService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getAdmin() {
    return this.afs.collection('admin').valueChanges();
  }
  getWorkers() {
    return this.afs.collection('workers').valueChanges();
  }
  getAccountant() {
    return this.afs.collection('Accounting').valueChanges();
  }
  getUsers() {
    return this.afs.collection('Users').valueChanges();
  }

}
