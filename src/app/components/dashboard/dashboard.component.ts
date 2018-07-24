import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WhoService } from '../../services/who.service';
import { EventService } from '../../services/event.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userIsLoggedIn;
  userIsAdmin = false;
  userIsClient = false;
  userIsWorker = false;
  userIsGazbar = false;
  tempResult;
  userEmail;
  events;
  eventToEdit;
  newBill;

  constructor(
    private as: AuthService,
    private who: WhoService,
    private es: EventService,
    private fms: FlashMessagesService
  ) { }


  getEvents() {
    this.es.getallEvents()
      .subscribe(data => {
        this.events = data;
        for (let x = 0; x + 1 < this.events.length; x++) {
          const start_timeOLD = this.events[x].start_time;
          const end_timeOLD = this.events[x].end_time;
          const start_time = new Date(this.events[x].start_time);
          const end_time = new Date(this.events[x].end_time);
          const start_usedincludingFree = new Date(this.events[x].start_usedincludingFree);
          const end_usedincludingFree = new Date(this.events[x].end_usedincludingFree);
          this.events[x].start_timeOLD = start_timeOLD;
          this.events[x].end_timeOLD = end_timeOLD;
          this.events[x].start_time = start_time.toLocaleString();
          this.events[x].end_time = end_time.toLocaleString();
          this.events[x].start_usedincludingFree = start_usedincludingFree.toLocaleString();
          this.events[x].end_usedincludingFree = end_usedincludingFree.toLocaleString();
        }
        this.events = this.events.filter(x => x.price - x.paid > 0);
        console.log(this.events);
      });
  }

  toEdit(event) {
    this.eventToEdit = event.id;
  }

  disableEdit() {
    this.eventToEdit = null;
    this.newBill = 0;
  }

  confirmEdit(event) {
    if (event.paid + this.newBill > event.price) {
      return (
        this.fms.show(' המחיר ששולם יותר גבוה מהמחיר של הפעילות ', { cssClass: 'danger', timeout: 3000 })
      );
    } else {
      const newEvent = { ...event, paid: event.paid + this.newBill };
      if (event.price === this.newBill + event.paid) {
        this.fms.show(' התשלום עודכן בהצלחה , ללקוח אין עוד חובות לשלם ', { cssClass: 'success', timeout: 5000 });
      }
      if (event.price > this.newBill + event.paid) {
        this.fms.show(' התשלום עודכן בהצלחה ', { cssClass: 'success', timeout: 3000 });
      }
      this.es.updateEvent(event.id, newEvent);
      this.eventToEdit = null;
    }
    this.newBill = 0;
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.as.getState()
      .subscribe(data => {
        if (data !== null) {
          this.userIsLoggedIn = true;
          this.userEmail = data.email;
          this.getAdmin();
        } else {
          this.userIsLoggedIn = false;
          this.userEmail = null;
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = false;
        }
      });
  }

  getAdmin() {
    this.who.getAdmin()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = true;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = false;
          return;
        } else {
          this.getWorker();
        }
      });
  }
  getWorker() {
    this.who.getWorkers()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = true;
          this.userIsGazbar = false;
          this.userIsClient = false;
        } else {
          this.getGazbar();
        }
      });
  }
  getGazbar() {
    this.who.getAccountant()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = true;
          this.userIsClient = false;
          this.getEvents();
        } else {
          this.getClient();
        }
      });
  }
  getClient() {
    this.who.getUsers()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = true;
        }
      });
  }

}
