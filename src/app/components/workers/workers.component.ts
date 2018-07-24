import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { WorkersService } from '../../services/workers.service';
import * as firebase from 'firebase';
import { FlashMessagesService } from 'angular2-flash-messages';

export const firebaseConfig = {
  apiKey: 'AIzaSyB6qX-M1o4m4pmMPv3U3Z4et2AXbBg7zMo',
  authDomain: 'mekif-app.firebaseapp.com',
  databaseURL: 'https://mekif-app.firebaseio.com',
  projectId: 'mekif-app',
  storageBucket: 'mekif-app.appspot.com',
  messagingSenderId: '182042258566'
};

export const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary');


@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkersComponent implements OnInit {

  addIconEnabled = true;
  EnableAddForm = false;
  Workers;
  errorMessage;
  newWorker = {
    Name: '',
    Email: '',
    Phone: '',
    Password: '',
    Id: '',
    Sunday: null,
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    role: 'worker'
  };
  workerToEdit;
  newWorkerToEdit = {
    Name: '',
    Email: '',
    Phone: '',
    Password: '',
    Id: '',
    Sunday: null,
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    role: 'worker'
  };
  newWorkerToEditNeedsHelp =
    {
      Email: null,
      Password: null
    };

  constructor(
    private ws: WorkersService,
    private fms: FlashMessagesService
  ) { }

  ngOnInit() {
    this.getWorkers();
  }

  cancelEdit() {
    this.newWorkerToEdit = {
      Name: '',
      Email: '',
      Phone: '',
      Password: '',
      Id: '',
      Sunday: null,
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      role: 'worker'
    };
    this.workerToEdit = null;
    this.fms.show('לא התעדכן שום עובד', { cssClass: 'primary', timeout: 3000 });
  }

  enableEditWorker(worker) {
    this.workerToEdit = worker.id;
    this.newWorkerToEdit.Name = worker.Name;
    this.newWorkerToEdit.Email = worker.Email;
    this.newWorkerToEdit.Phone = worker.Phone;
    this.newWorkerToEdit.Password = worker.Password;
    this.newWorkerToEdit.Id = worker.Id;
    this.newWorkerToEdit.Sunday = worker.Sunday;
    this.newWorkerToEdit.Monday = worker.Monday;
    this.newWorkerToEdit.Tuesday = worker.Tuesday;
    this.newWorkerToEdit.Wednesday = worker.Wednesday;
    this.newWorkerToEdit.Thursday = worker.Thursday;
    this.newWorkerToEdit.Friday = worker.Friday;
    this.newWorkerToEdit.role = worker.role;
    this.newWorkerToEditNeedsHelp.Email = worker.Email;
    this.newWorkerToEditNeedsHelp.Password = worker.Password;
  }

   DeleteWorker(worker) {
    if (confirm('מחיקת עובד היא פעולה שלא ניתנה להחזרה ! אתה מאשר סופית?')) {
      secondaryApp.auth().signInWithEmailAndPassword(worker.Email, worker.Password)
        .then(() => {
          const user = secondaryApp.auth().currentUser;
          user.delete();
          this.ws.deleteWorkerfromDB(worker.id);
          this.fms.show('מחקת עובד בהצלחה', { cssClass: 'primary', timeout: 3000 });
        });
    }
  }
  

  addWorker() {
    secondaryApp.auth().createUserWithEmailAndPassword(this.newWorker.Email, this.newWorker.Password)
      .then(() => {
        this.ws.addWorkerToDatabase(this.newWorker);
        this.fms.show('הוספת עובד חדש בהצלחה', { cssClass: 'success', timeout: 3000 });
        this.reset();
      })
      .then(() => {
        secondaryApp.auth().signOut();
      })
      .catch(err => {
        this.errorMessage = err.message;
        this.fms.show(err, { cssClass: 'danger', timeout: 3000 });
      });
  }
  

  
  editWorker(id) {
    secondaryApp.auth().signInWithEmailAndPassword(this.newWorkerToEditNeedsHelp.Email, this.newWorkerToEditNeedsHelp.Password).
      then(() => {
        const user = secondaryApp.auth().currentUser;
        user.updateEmail(this.newWorkerToEdit.Email);
      })
      .then(() => secondaryApp.auth().signOut())
      .then(() => {
        this.ws.EditWorkerOnDB(id, this.newWorkerToEdit)
          .then(() => {
            this.fms.show('עובד עודכן  בהצלחה', { cssClass: 'success', timeout: 3000 });
            this.reset();
          });
      });
  }
  

  getWorkers() {
    this.ws.getWorkers()
      .subscribe(data => {
        this.Workers = data;
        console.log(this.Workers);
      });
  }

  addIconFun() {
    if (this.addIconEnabled === true) {
      this.addIconEnabled = false;
      this.EnableAddForm = true;
      return 0;
    }
    if (this.addIconEnabled === false) {
      this.addIconEnabled = true;
      this.EnableAddForm = false;
      return 0;
    }
  }

  reset() {
    this.addIconEnabled = true;
    this.EnableAddForm = false;
    this.newWorker = {
      Name: '',
      Email: '',
      Phone: '',
      Password: '',
      Id: '',
      Sunday: null,
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      role: 'worker'
    };
    this.workerToEdit = null;
    this.newWorkerToEdit = {
      Name: '',
      Email: '',
      Phone: '',
      Password: '',
      Id: '',
      Sunday: null,
      Monday: null,
      Tuesday: null,
      Wednesday: null,
      Thursday: null,
      Friday: null,
      role: 'worker'
    };
    this.newWorkerToEditNeedsHelp = {
      Email: null,
      Password: null
    };
  }

}
