import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class CheckavailableService {

  constructor(
    private afs: AngularFirestore
  ) { }

  check() {
    return this.afs.collection('used_dates').valueChanges();
  }

  addUsedDates(newUsedDate) {
    this.afs.collection('used_dates').add(newUsedDate);
  }

}
