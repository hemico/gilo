import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkersService {

  constructor(
    private fb: AngularFireAuth,
    private afs: AngularFirestore
  ) { }


  EditWorkerOnDB(id , newDetails) {
    return this.afs.collection('workers').doc(id).update(newDetails);
  }

  deleteWorkerfromDB(id) {
    this.afs.collection('workers').doc(id).delete();
  }

  addWorker(email, password) {
    return this.fb.auth.createUserWithEmailAndPassword(email, password);
  }

  addWorkerToDatabase(newWorker) {
    this.afs.collection('workers').add(newWorker);
  }

  getWorkers() {
    return this.afs.collection('workers').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }


}
