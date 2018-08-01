import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afs: AngularFirestore
  ) { }


  addUserToDatabase(User) {
    return this.afs.collection('Users').add(User);
  }

  deleteUser(id) {
    return this.afs.collection('Users').doc(id).delete();
  }

  getUnconfirmedUsers() {
    return this.afs.collection('Users', ref => ref.where('Confirmed', '==', false)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getconfirmedUsers() {
    return this.afs.collection('Users', ref => ref.where('Confirmed', '==', true)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

getUserByEmail(Email) {
  return this.afs.collection('Users', ref => ref.where('Email', '==', Email)).snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
}

getAllUsers() {
  return this.afs.collection('Users').snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
}

approveUser(id , newDetails) {
  return this.afs.collection('Users').doc(id).update(newDetails);
}

}
