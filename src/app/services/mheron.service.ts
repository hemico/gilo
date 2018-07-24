import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MheronService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getMheron() {
    return this.afs.collection('Mheron').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateMheron(id , newMheron) {
    return this.afs.collection('Mheron').doc(id).update(newMheron);
  }

}
