import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { WhoService } from '../../services/who.service';
import { MaterializeAction } from 'angular2-materialize';
import { Router } from '@angular/router';
import { CheckavailableService } from '../../services/checkavailable.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent implements OnInit {

  usedClass: Array<string> = [];
  used_dates;
  checkwithAuditorium;
  checkwithAmnot;
  checkwithLobby;
  checkwithClassA;
  checkwithClassB;
  checkwithClassC;
  checkwithClassD;
  checkwithClassE;
  newUsedDate;
  tempResult;
  events;
  deletedevents;
  unconfirmedevents;
  pastEvents;
  futureEvents;
  userEmail;
  sortedbyName = false;
  sortedbybeginTime = false;
  sortedbyendTime = false;
  sortedbyprice = false;
  sortedbybill = false;
  userIsLoggedIn = false;
  userIsAdmin = false;
  userIsWorker = false;
  userIsGazbar = false;
  userIsClient = false;
  tempEvent = {
    name: ''
  };
  DiscountTo;
  DiscountPercentage;
  eventSentBackToClient;

  todaysDate = new Date().getTime();

  constructor(
    private es: EventService,
    private as: AuthService,
    private fms: FlashMessagesService,
    private who: WhoService,
    private router: Router,
    private check: CheckavailableService,
  ) { }
  modalActions = new EventEmitter<string | MaterializeAction>();

  openDiscount(event) {
    this.DiscountTo = event;
  }

  approvePriceChange() {
    if (this.DiscountPercentage > 99 || this.DiscountPercentage < 1) {
      this.fms.show('לא ניתן לתת הנחה כזו', { cssClass: 'danger', timeout: 5000 });
      this.DiscountPercentage = null;
      return 0;
    } else {
      this.DiscountTo.start_time = this.DiscountTo.start_timeOLD;
      this.DiscountTo.end_time = this.DiscountTo.end_timeOLD;
      this.DiscountTo.price = (100 - this.DiscountPercentage) * this.DiscountTo.price / 100;
      this.es.updateEvent(this.DiscountTo.id, this.DiscountTo)
        .then(() => {
          this.DiscountTo = null;
          this.DiscountPercentage = null;
          this.fms.show('ההנחה בוצעה בהצלחה', { cssClass: 'success', timeout: 5000 });
        });
    }
  }

  approvePriceChangeUnconfirmed() {
    if (this.DiscountPercentage > 99 || this.DiscountPercentage < 1) {
      this.fms.show('לא ניתן לתת הנחה כזו', { cssClass: 'danger', timeout: 5000 });
      this.DiscountPercentage = null;
      return 0;
    } else {
      this.DiscountTo.start_time = this.DiscountTo.start_timeOLD;
      this.DiscountTo.end_time = this.DiscountTo.end_timeOLD;
      this.DiscountTo.price = (100 - this.DiscountPercentage) * this.DiscountTo.price / 100;
      this.es.updateEventUnconfirmed(this.DiscountTo.id, this.DiscountTo)
        .then(() => {
          this.DiscountTo = null;
          this.DiscountPercentage = null;
          this.fms.show('ההנחה בוצעה בהצלחה', { cssClass: 'success', timeout: 5000 });
        });
    }
  }

  sendToBackToClient(event) {
    event.start_time = event.start_timeOLD;
    event.end_time = event.end_timeOLD;
    console.log(event);
    this.es.addSentBackToClient(event)
      .then((success) => {
        event.id = success.id;
        this.es.updateSentBackToClient(event.id, event);
      });
    this.es.deleteUnconfirmedEvent(event.id);
    this.fms.show('שליחת האירוע בחזרה ללקוח בוצעה בהצלחה', { cssClass: 'success', timeout: 5000 });
  }

  openModal(x) {
    this.modalActions.emit({ action: 'modal', params: ['open'] });
    this.tempEvent = x;
  }
  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
    this.tempEvent = { name: '' };
  }

  ngOnInit() {
    this.getUser();
    this.getAvailableDates();
  }

  deleteEvent(event) {
    if (confirm('הינך עומד לבטל את האירוע, ידוע לי שלא ניתן יהיה להחזיר את האירוע ומועד האירוע מתפנה ללקוח אחר')) {
      this.es.deleteEvent(event.id);
      this.es.addDeletedEvent(event);
      this.fms.show('האירוע נמחק בהצלחה', { cssClass: 'deletesuccess', timeout: 5000 });
    }
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
          this.getAdminEvents();
          this.getdeletedEvents();
          this.getUnconfirmedEvents();
        } else {
          this.getWorker();
        }
      });
  }

  getdeletedEvents() {
    this.es.getallDeletedEvents()
      .subscribe(data => {
        this.deletedevents = data;
        for (let x = 0; x < this.deletedevents.length; x++) {
          const start_timeOLD = this.deletedevents[x].start_time;
          const end_timeOLD = this.deletedevents[x].end_time;
          const start_time = new Date(this.deletedevents[x].start_time);
          const end_time = new Date(this.deletedevents[x].end_time);
          const start_usedincludingFree = new Date(this.deletedevents[x].start_usedincludingFree);
          const end_usedincludingFree = new Date(this.deletedevents[x].end_usedincludingFree);
          this.deletedevents[x].start_timeOLD = start_timeOLD;
          this.deletedevents[x].end_timeOLD = end_timeOLD;
          this.deletedevents[x].start_time = start_time.toLocaleString();
          this.deletedevents[x].end_time = end_time.toLocaleString();
          this.deletedevents[x].start_usedincludingFree = start_usedincludingFree.toLocaleString();
          this.deletedevents[x].end_usedincludingFree = end_usedincludingFree.toLocaleString();
        }
      });
  }

  getUnconfirmedEvents() {
    this.es.getallUnconfirmedEvents()
      .subscribe(data => {
        this.unconfirmedevents = data;
        for (let x = 0; x < this.unconfirmedevents.length; x++) {
          const start_timeOLD = this.unconfirmedevents[x].start_time;
          const end_timeOLD = this.unconfirmedevents[x].end_time;
          const start_time = new Date(this.unconfirmedevents[x].start_time);
          const end_time = new Date(this.unconfirmedevents[x].end_time);
          this.unconfirmedevents[x].start_timeOLD = start_timeOLD;
          this.unconfirmedevents[x].end_timeOLD = end_timeOLD;
          this.unconfirmedevents[x].start_time = start_time.toLocaleString();
          this.unconfirmedevents[x].end_time = end_time.toLocaleString();
        }
        console.log(this.unconfirmedevents);
      });
  }

  getAdminEvents() {
    this.es.getallEvents()
      .subscribe(data => {
        this.events = data;
        for (let x = 0; x < this.events.length; x++) {
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
        this.pastEvents = this.events.filter(x => x.start_timeOLD < this.todaysDate);
        this.futureEvents = this.events.filter(x => x.start_timeOLD > this.todaysDate);
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
          this.getWorkerEvents();
        } else {
          this.getClient();
        }
      });
  }

  getWorkerEvents() {
    this.es.getallEvents()
      .subscribe(data => {
        this.events = data;
        for (let x = 0; x < this.events.length; x++) {
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
        console.log(this.events);
        console.log(this.pastEvents);
        console.log(this.futureEvents);
        if (this.tempResult[0].Sunday !== true) {
          this.events = this.events.filter(x => x.theDay !== 0);
        }
        if (this.tempResult[0].Monday !== true) {
          this.events = this.events.filter(x => x.theDay !== 1);
        }
        if (this.tempResult[0].Tuesday !== true) {
          this.events = this.events.filter(x => x.theDay !== 2);
        }
        if (this.tempResult[0].Wednesday !== true) {
          this.events = this.events.filter(x => x.theDay !== 3);
        }
        if (this.tempResult[0].Thursday !== true) {
          this.events = this.events.filter(x => x.theDay !== 4);
        }
        if (this.tempResult[0].Friday !== true) {
          this.events = this.events.filter(x => x.theDay !== 5);
        }
        this.pastEvents = this.events.filter(x => x.start_timeOLD <= this.todaysDate);
        this.futureEvents = this.events.filter(x => x.start_timeOLD > this.todaysDate);
        console.log(this.events);
        console.log(this.pastEvents);
        console.log(this.futureEvents);
      });
  }

  getClient() {
    console.log('called');
    this.who.getUsers()
      .subscribe(data => {
        this.tempResult = data;
        this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
        if (this.tempResult.length > 0) {
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = true;
          this.getClientEvents();
          this.getClientEventsSentBack();
        }
      });
  }

  getClientEventsSentBack() {
    this.es.getEventByUserSentBack(this.userEmail)
      .subscribe(data => {
        if (data.length > 0) {
          this.eventSentBackToClient = data[0];
          const start_timeOLD = this.eventSentBackToClient.start_time;
          const end_timeOLD = this.eventSentBackToClient.end_time;
          const start_time = new Date(this.eventSentBackToClient.start_time);
          const end_time = new Date(this.eventSentBackToClient.end_time);
          this.eventSentBackToClient.start_timeOLD = start_timeOLD;
          this.eventSentBackToClient.end_timeOLD = end_timeOLD;
          this.eventSentBackToClient.start_time = start_time.toLocaleString();
          this.eventSentBackToClient.end_time = end_time.toLocaleString();
          console.log(this.eventSentBackToClient);
        }
      });
  }

  getClientEvents() {
    this.es.getEventByUser(this.userEmail)
      .subscribe(data => {
        this.events = data;
        for (let x = 0; x < this.events.length; x++) {
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
        this.pastEvents = this.events.filter(x => x.start_timeOLD < this.todaysDate);
        this.futureEvents = this.events.filter(x => x.start_timeOLD > this.todaysDate);
        this.futureEvents = this.futureEvents.sort((a, b) => a.start_timeOLD > b.start_timeOLD ? 1 : -1);
        this.pastEvents = this.pastEvents.sort((a, b) => a.start_timeOLD > b.start_timeOLD ? 1 : -1);
      });
  }



  sortFuture(type) {
    if (type === 'Name' && !this.sortedbyName) {
      this.events = this.futureEvents.sort((a, b) => a.name > b.name ? 1 : -1);
      this.sortedbyName = true;
      return;
    }
    if (type === 'Name' && this.sortedbyName) {
      this.events = this.futureEvents.sort((a, b) => a.name > b.name ? -1 : 1);
      this.sortedbyName = false;
      return;
    }
    if (type === 'beginTime' && !this.sortedbybeginTime) {
      this.events = this.futureEvents.sort((a, b) => a.start_timeOLD > b.start_timeOLD ? 1 : -1);
      this.sortedbybeginTime = true;
      return;
    }
    if (type === 'beginTime' && this.sortedbybeginTime) {
      this.events = this.futureEvents.sort((a, b) => a.start_timeOLD > b.start_timeOLD ? -1 : 1);
      this.sortedbybeginTime = false;
      return;
    }
    if (type === 'endTime' && !this.sortedbyendTime) {
      this.events = this.futureEvents.sort((a, b) => a.end_timeOLD > b.end_timeOLD ? 1 : -1);
      this.sortedbyendTime = true;
      return;
    }
    if (type === 'endTime' && this.sortedbyendTime) {
      this.events = this.futureEvents.sort((a, b) => a.end_timeOLD > b.end_timeOLD ? -1 : 1);
      this.sortedbyendTime = false;
      return;
    }
    if (type === 'price' && !this.sortedbyprice) {
      this.events = this.futureEvents.sort((a, b) => a.price > b.price ? 1 : -1);
      this.sortedbyprice = true;
      return;
    }
    if (type === 'price' && this.sortedbyprice) {
      this.events = this.futureEvents.sort((a, b) => a.price > b.price ? -1 : 1);
      this.sortedbyprice = false;
      return;
    }
    if (type === 'bill' && !this.sortedbybill) {
      this.events = this.futureEvents.sort((a, b) => a.price - a.paid > b.price - b.paid ? 1 : -1);
      this.sortedbybill = true;
      return;
    }
    if (type === 'bill' && this.sortedbybill) {
      this.events = this.futureEvents.sort((a, b) => a.price - a.paid > b.price - b.paid ? -1 : 1);
      this.sortedbybill = false;
      return;
    }
  }

  sortPast(type) {
    if (type === 'Name' && !this.sortedbyName) {
      this.events = this.pastEvents.sort((a, b) => a.name > b.name ? 1 : -1);
      this.sortedbyName = true;
      return;
    }
    if (type === 'Name' && this.sortedbyName) {
      this.events = this.pastEvents.sort((a, b) => a.name > b.name ? -1 : 1);
      this.sortedbyName = false;
      return;
    }
    if (type === 'beginTime' && !this.sortedbybeginTime) {
      this.events = this.pastEvents.sort((a, b) => a.start_timeOLD > b.start_timeOLD ? 1 : -1);
      this.sortedbybeginTime = true;
      return;
    }
    if (type === 'beginTime' && this.sortedbybeginTime) {
      this.events = this.pastEvents.sort((a, b) => a.start_timeOLD > b.start_timeOLD ? -1 : 1);
      this.sortedbybeginTime = false;
      return;
    }
    if (type === 'endTime' && !this.sortedbyendTime) {
      this.events = this.pastEvents.sort((a, b) => a.end_timeOLD > b.end_timeOLD ? 1 : -1);
      this.sortedbyendTime = true;
      return;
    }
    if (type === 'endTime' && this.sortedbyendTime) {
      this.events = this.pastEvents.sort((a, b) => a.end_timeOLD > b.end_timeOLD ? -1 : 1);
      this.sortedbyendTime = false;
      return;
    }
    if (type === 'price' && !this.sortedbyprice) {
      this.events = this.pastEvents.sort((a, b) => a.price > b.price ? 1 : -1);
      this.sortedbyprice = true;
      return;
    }
    if (type === 'price' && this.sortedbyprice) {
      this.events = this.pastEvents.sort((a, b) => a.price > b.price ? -1 : 1);
      this.sortedbyprice = false;
      return;
    }
    if (type === 'bill' && !this.sortedbybill) {
      this.events = this.pastEvents.sort((a, b) => a.price - a.paid > b.price - b.paid ? 1 : -1);
      this.sortedbybill = true;
      return;
    }
    if (type === 'bill' && this.sortedbybill) {
      this.events = this.pastEvents.sort((a, b) => a.price - a.paid > b.price - b.paid ? -1 : 1);
      this.sortedbybill = false;
      return;
    }
  }

  getAvailableDates() {
    this.check.check()
      .subscribe(data => {
        this.used_dates = data;
      });
  }


  ConfirmEvent2(x) {
    x.start_time = new Date(x.start_time).getTime();
    x.end_time = new Date(x.end_time).getTime();
    console.log(x);
  }

    ConfirmEvent(x) {
    this.eventSentBackToClient = null;
    x.start_time = new Date(x.start_time).getTime();
    x.end_time = new Date(x.end_time).getTime();

    if (x.auditorium === true) {
      this.usedClass.push('אודיטוריום');
      this.checkwithAuditorium = 'אודיטוריום';
    }
    if (x.amnot === true) {
      this.usedClass.push('סטודיו');
      this.checkwithAmnot = 'סטודיו';
    }
    if (x.lobby === true) {
      this.usedClass.push('לובי');
      this.checkwithLobby = 'לובי';
    }
    if (x.classA === true) {
      this.usedClass.push('מעבדה א');
      this.checkwithClassA = 'מעבדה א';
    }
    if (x.classB === true) {
      this.usedClass.push('מעבדה ב');
      this.checkwithClassB = 'מעבדה ב';
    }
    if (x.classC === true) {
      this.usedClass.push('מעבדה ג');
      this.checkwithClassC = 'מעבדה ג';
    }
    if (x.classD === true) {
      this.usedClass.push('מעבדה ד');
      this.checkwithClassD = 'מעבדה ד';
    }
    if (x.classE === true) {
      this.usedClass.push('מעבדה ה');
      this.checkwithClassE = 'מעבדה ה';
    }
    this.newUsedDate = {
      start_used: x.start_timeOLD,
      end_used: x.end_timeOLD,
      start_usedincludingFree: x.start_usedincludingFree,
      end_usedincludingFree: x.end_usedincludingFree,
      day: x.day,
      month: x.month,
      year: x.year,
      usedClass: this.usedClass
    };
    for (let i = 0; i < this.used_dates.length; i++) {

      if ((x.start_timeOLD >= this.used_dates[i].start_usedincludingFree && x.start_timeOLD <= this.used_dates[i].end_usedincludingFree) &&
        (x.end_timeOLD >= this.used_dates[i].start_usedincludingFree && x.end_timeOLD <= this.used_dates[i].end_usedincludingFree) &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
        this.fms.show('האירוע הוסר , נא ליצור אירוע מחדש', { cssClass: 'danger', timeout: 6000 });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 6000);
        return 0;
      }
      if (x.start_timeOLD > this.used_dates[i].end_usedincludingFree && x.end_timeOLD > this.used_dates[i].end_usedincludingFree &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        if ((this.used_dates[i].start_usedincludingFree > x.start_timeOLD && this.used_dates[i].start_usedincludingFree < x.end_timeOLD) ||
          (this.used_dates[i].end_usedincludingFree > x.start_timeOLD && this.used_dates[i].end_usedincludingFree < x.end_timeOLD)) {
          this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
          this.fms.show('האירוע הוסר , נא ליצור אירוע מחדש', { cssClass: 'danger', timeout: 6000 });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 6000);
          return 0;
        } else {
        }
      }
      if (x.start_timeOLD < this.used_dates[i].start_usedincludingFree && x.end_timeOLD < this.used_dates[i].start_usedincludingFree &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year
      ) {
      }
      if (x.start_timeOLD < this.used_dates[i].start_usedincludingFree && x.end_timeOLD > this.used_dates[i].end_usedincludingFree &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        if ((this.used_dates[i].start_usedincludingFree > x.start_timeOLD && this.used_dates[i].start_usedincludingFree < x.end_timeOLD) ||
          (this.used_dates[i].end_usedincludingFree > x.start_timeOLD && this.used_dates[i].end_usedincludingFree < x.end_timeOLD)) {
          this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
          this.fms.show('האירוע הוסר , נא ליצור אירוע מחדש', { cssClass: 'danger', timeout: 6000 });
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 6000);
          return 0;
        } else {

        }
      }

      if (x.start_timeOLD > this.used_dates[i].end_usedincludingFree && x.end_timeOLD < this.used_dates[i].start_usedincludingFree &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
        this.fms.show('האירוע הוסר , נא ליצור אירוע מחדש', { cssClass: 'danger', timeout: 6000 });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 6000);
        return 0;
      }

      if (
        ((x.start_timeOLD >= this.used_dates[i].start_usedincludingFree) && (x.start_timeOLD < this.used_dates[i].end_usedincludingFree)) &&
        (x.end_timeOLD > this.used_dates[i].end_usedincludingFree || x.end_timeOLD < this.used_dates[i].start_usedincludingFree) &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
        this.fms.show('האירוע הוסר , נא ליצור אירוע מחדש', { cssClass: 'danger', timeout: 6000 });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 6000);
        return 0;
      }

      if (
        ((x.end_timeOLD >= this.used_dates[i].start_usedincludingFree) && (x.end_timeOLD <= this.used_dates[i].end_usedincludingFree)) &&
        (x.start_timeOLD > this.used_dates[i].end_usedincludingFree || x.start_timeOLD < this.used_dates[i].start_usedincludingFree) &&
        x.day === this.used_dates[i].day && x.month === this.used_dates[i].month && x.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
        this.fms.show('האירוע הוסר , נא ליצור אירוע מחדש', { cssClass: 'danger', timeout: 6000 });
        setTimeout(() => {
          this.router.navigate(['/createevent']);
        }, 6000);
        return 0;
      }
      this.es.addEvent(x);
      this.es.deleteSentBackToClient(x.id);
      this.check.addUsedDates(this.newUsedDate);
      this.fms.show('הוספת אירוע בהצלחה', { cssClass: 'success', timeout: 4000 });
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 4000);
      return 0;
    }

  }

}
