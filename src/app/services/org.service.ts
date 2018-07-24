import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrgService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getOrganizations() {
    return this.afs.collection('organizations').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  addOrganization(newOrginization) {
    return this.afs.collection('organizations').add(newOrginization);
  }

  DeleteOrganization(id) {
    return this.afs.collection('organizations').doc(id).delete()
      .then( () => {
        console.log('Document successfully deleted!');
      }).catch( (error) => {
        console.error('Error removing document: ', error);
      });
  }
}
