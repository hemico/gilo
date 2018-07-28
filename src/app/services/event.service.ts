import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private afs: AngularFirestore
  ) { }

  addEvent(newEvent) {
    this.afs.collection('events').add(newEvent);
  }

  addDeletedEvent(newEvent) {
    this.afs.collection('deletedevents').add(newEvent);
  }

  addUncofirmedEvent(newEvent) {
    this.afs.collection('unconfirmedevents').add(newEvent);
  }

  getallEvents() {
    return this.getallEventsPipe().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getallEventsPipe() {
    return this.afs.collection('events' , ref => ref.orderBy('start_time' , 'asc')).snapshotChanges();
  }

  getNextEvent(time) {
    return this.afs.collection('events' , ref => ref.where('start_time' , '>' , time).orderBy('start_time' , 'asc').limit(1)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getPreviousEvent(time) {
    return this.afs.collection('events' , ref => ref.where('start_time' , '<' , time).orderBy('start_time' , 'desc').limit(1)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getallDeletedEvents() {
    return this.afs.collection('deletedevents').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getallUnconfirmedEvents() {
    return this.afs.collection('unconfirmedevents').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getEventByUser(userEmail) {
    return this.afs.collection('events', ref => ref.where('createdBy', '==', userEmail)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getEventByUserSentBack(userEmail) {
    return this.afs.collection('sentbacktoclient', ref => ref.where('createdBy', '==', userEmail).limit(1)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getEventsByOrganization(Org) {
    return this.afs.collection('events', ref => ref.where('orgName', '==', Org)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  deleteEvent(id) {
    return this.afs.collection('events').doc(id).delete();
  }

  deleteUnconfirmedEvent(id) {
    return this.afs.collection('unconfirmedevents').doc(id).delete();
  }

  addSentBackToClient(newEvent) {
    return this.afs.collection('sentbacktoclient').add(newEvent);
  }
  deleteSentBackToClient(id) {
    return this.afs.collection('sentbacktoclient').doc(id).delete();
  }
  updateSentBackToClient(id , newObj) {
    return this.afs.collection('sentbacktoclient').doc(id).update(newObj);
  }

  updateEvent(id , newObj) {
    return this.afs.collection('events').doc(id).update(newObj);
  }

  updateEventUnconfirmed(id , newObj) {
    return this.afs.collection('unconfirmedevents').doc(id).update(newObj);
  }


}
