import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getMsg() {
    return this.afs.collection('msgtoworkers').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateMsg(id, newMsg) {
    return this.afs.collection('msgtoworkers').doc(id).update(newMsg);
  }

  getClientMsg() {
    return this.afs.collection('msgtoclients').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  updateClientMsg(id, newMsg) {
    return this.afs.collection('msgtoclients').doc(id).update(newMsg);
  }

}
