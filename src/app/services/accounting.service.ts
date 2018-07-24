import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getAccountant() {
    return this.afs.collection('Accounting').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateAccountant(id, newDetails) {
    return this.afs.collection('Accounting').doc(id).update(newDetails);
  }


}
