import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CheckavailableService } from '../../services/checkavailable.service';
import { MheronService } from '../../services/mheron.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MaterializeAction } from 'angular2-materialize';
import {WhoService} from "../../services/who.service";

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateeventComponent implements OnInit {


  paid = 0;
  checkwithAuditorium;
  checkwithAmnot;
  checkwithLobby;
  checkwithClassA;
  checkwithClassB;
  checkwithClassC;
  checkwithClassD;
  checkwithClassE;
  eventName;
  classA = false;
  classB = false;
  classC = false;
  classD = false;
  classE = false;
  lobby = false;
  amnot = false;
  auditorium = false;
  personLight = false;
  personSound = false;
  microphones = false;
  mdonot = false;
  chairs = false;
  tables = false;
  date;
  year;
  month;
  day;
  startTime;
  endTime;
  startHour;
  startMinute;
  endHour;
  endMinute;
  lastDate1;
  lastDate2;
  lastDate3;
  lastDate4;
  newEvent;
  used_dates;
  newUsedDate;
  mheron;
  price = 0;
  user;
  usedClass: Array<string> = [];
  moreInfo;
  microphonesAmount = null;
  mdonotAmount = null;
  chairsAmount = null;
  tablesAmount = null;
  fullUserInfoFromDb;
  userIsNotConfirmedYet;
  theDay;
  noRoomChosen;
  noAccessoriesChosen = false;
  approvetakanon;
  minDate = '';

  constructor(
    private es: EventService,
    private who: WhoService,
    private check: CheckavailableService,
    private mheronService: MheronService,
    private authService: AuthService,
    private fms: FlashMessagesService,
    private router: Router,
    private us: UserService
  ) { }

  modalActions = new EventEmitter<string | MaterializeAction>();
  modalActions2 = new EventEmitter<string | MaterializeAction>();

  openModalTakanon() {
    this.modalActions2.emit({ action: 'modal', params: ['open'] });
  }
  closeModalfree() {
    this.modalActions2.emit({ action: 'modal', params: ['close'] });
  }

  openModal() {


    this.modalActions.emit({ action: 'modal', params: ['open'] });

    if (this.auditorium === false && this.amnot === false && this.lobby === false && this.classA === false
      && this.classB === false && this.classC === false && this.classD === false && this.classE === false) {
      this.noRoomChosen = true;
    }
    if (this.personSound === false && this.personLight === false && this.tables === false && this.chairs === false
      && this.mdonot === false && this.microphones === false) {
      this.noAccessoriesChosen = true;
    }

    this.year = this.date.substring(0, 4);
    this.month = this.date.substring(5, 7);
    this.day = this.date.substring(8, 10);
    this.startHour = this.startTime.substring(0, 2);
    this.startHour = parseInt(this.startHour, 10);
    this.endHour = this.endTime.substring(0, 2);
    this.endHour = parseInt(this.endHour, 10);
    this.startMinute = this.startTime.substring(3, 5);
    this.startMinute = parseInt(this.startMinute, 10);
    this.endMinute = this.endTime.substring(3, 5);
    this.endMinute = parseInt(this.endMinute, 10);
    this.lastDate1 = new Date(this.year, this.month - 1, this.day, this.startHour, this.startMinute).getTime();
    this.lastDate2 = new Date(this.year, this.month - 1, this.day, this.endHour, this.endMinute).getTime();
    this.lastDate3 = new Date(this.year, this.month - 1, this.day, (this.startHour - 1), (this.startMinute + 1)).getTime();
    this.lastDate4 = new Date(this.year, this.month - 1, this.day, (this.endHour + 1), (this.endMinute - 1)).getTime();

    if (this.auditorium === true && (this.endHour - this.startHour <= 3)) {
      this.price = this.price + this.mheron[0].auditoriumminimumprice;
    }
    if (this.auditorium === true && (this.endHour - this.startHour > 3 && this.endHour - this.startHour <= this.mheron[0].kamotshaotbyom)) {
      const tempVar = (this.endHour - this.startHour - 3) * this.mheron[0].odoteriumshaate;
      this.price = this.price + this.mheron[0].auditoriumminimumprice + tempVar;
    }
    if (this.auditorium === true && (this.endHour - this.startHour > this.mheron[0].kamotshaotbyom)) {
      this.price = this.price + this.mheron[0].odoteriumyome;
    }
    if (this.amnot === true) {
      this.price = this.price + this.mheron[0].hederomanot * (this.endHour - this.startHour);
    }
    if (this.lobby === true) {
      this.price = this.price + this.mheron[0].lobby * (this.endHour - this.startHour);
    }
    if (this.classA === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classB === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classC === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classD === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classE === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.personLight === true && this.personSound === true) {
      this.price = this.price + this.mheron[0].hagbaraandteora;
    }
    if (this.personLight === true && this.personSound === false) {
      this.price = this.price + this.mheron[0].teora;
    }
    if (this.personLight === false && this.personSound === true) {
      this.price = this.price + this.mheron[0].hagbara;
    }
  }
  closeModal() {
    this.modalActions.emit({ action: 'modal', params: ['close'] });
    this.addEvent2();
  }

  ngOnInit() {
    this.getAvailableDates();
    this.getMheron();
    this.getAuthDetails();
    this.setMinDate();
  }

  setMinDate() {
    let tempx = '';
    let tempy = '';
    let tempz = '';
    const x = new Date().getDate();
    let y = new Date().getMonth();
    const z = new Date().getFullYear();
    if (y === 11) {
      tempy = String('0');
    } else if (y === 9) {
      tempy = String('10');
    } else {
      y = y + 1;
      tempy = String('0' + y);
    }
    if ( x < 10 ) {
      tempx = '0' + x + 1;
    }
    if ( x > 10 ) {
      tempx = String(x + 1);
    }
    tempz = String(z);
    this.minDate  = ( tempz + '-' + tempy + '-' + tempx );
  }

  getAuthDetails() {
    this.authService.getState().subscribe(data => {
      if (data !== null) {
        this.user = data;
        this.us.getUserByEmail(this.user.email)
          .subscribe(data2 => {
            this.fullUserInfoFromDb = data2[0];
            if (!this.fullUserInfoFromDb) {
              this.getAdmin();
            } else {
              this.userIsNotConfirmedYet = !this.fullUserInfoFromDb.Confirmed;
            }
          });
      }
    });
  }

  getAdmin() {
    this.who.getAdmin()
      .subscribe(data => {
        if (!!data.find(x => x.Email === this.user.email)) {
          this.userIsNotConfirmedYet = false;
          this.fullUserInfoFromDb = {
            Name: 'מנהל מערכת',
            Org: 'מקיף גילה'
          };
        }
      });
  }

  getAvailableDates() {
    this.check.check()
      .subscribe(data => {
        this.used_dates = data;
      });
  }

  getMheron() {
    this.mheronService.getMheron()
      .subscribe(data => {
        this.mheron = data;
      });
  }


  addEvent2() {
    this.theDay = new Date(this.date).getDay();
    if (this.theDay === 6) {
      this.fms.show('לא ניתן לשבץ אירוע ביום שבת', { cssClass: 'danger', timeout: 4000 });
      return 0;
    }
    if (this.auditorium === false && this.amnot === false && this.lobby === false && this.classA === false
      && this.classB === false && this.classC === false && this.classD === false && this.classE === false) {
      this.noRoomChosen = true;
      this.fms.show('לא נבחר שום חדר', { cssClass: 'danger', timeout: 4000 });
      return 0;
    }
    this.year = this.date.substring(0, 4);
    this.month = this.date.substring(5, 7);
    this.day = this.date.substring(8, 10);
    this.startHour = this.startTime.substring(0, 2);
    this.startHour = parseInt(this.startHour, 10);
    this.endHour = this.endTime.substring(0, 2);
    this.endHour = parseInt(this.endHour, 10);
    this.startMinute = this.startTime.substring(3, 5);
    this.startMinute = parseInt(this.startMinute, 10);
    this.endMinute = this.endTime.substring(3, 5);
    this.endMinute = parseInt(this.endMinute, 10);
    this.lastDate1 = new Date(this.year, this.month - 1, this.day, this.startHour, this.startMinute).getTime();
    this.lastDate2 = new Date(this.year, this.month - 1, this.day, this.endHour, this.endMinute).getTime();
    this.lastDate3 = new Date(this.year, this.month - 1, this.day, (this.startHour - 1), (this.startMinute + 1)).getTime();
    this.lastDate4 = new Date(this.year, this.month - 1, this.day, (this.endHour + 1), (this.endMinute - 1)).getTime();
    if (this.startHour > this.endHour) {
      this.fms.show('השעה ההתחלתית לא יכולה להיות אחרי שעת הסיום', { cssClass: 'danger', timeout: 4000 });
      return;
    }
    if (this.endHour - this.startHour < 1) {
      this.fms.show('מינימום הזמנה זה שעה', { cssClass: 'danger', timeout: 4000 });
      return;
    }
    if (this.startHour < 6 || this.startHour > 22) {
      this.fms.show('לא ניתן לקבל הצעה לפי השעות שבחרת. אפשר לקבל הצעה רק אחרי 6 בבוקר , והצעה אחרונה רק עד 10 בלילה', { cssClass: 'danger', timeout: 10000 });
      return;
    }
    if (this.startMinute === 0) {
      this.startMinute = 59;
    } else {
      this.startMinute = this.startMinute - 1;
    }
    if (this.auditorium === true) {
      this.usedClass.push('אודיטוריום');
      this.checkwithAuditorium = 'אודיטוריום';
    }
    if (this.amnot === true) {
      this.usedClass.push('סטודיו');
      this.checkwithAmnot = 'סטודיו';
    }
    if (this.lobby === true) {
      this.usedClass.push('לובי');
      this.checkwithLobby = 'לובי';
    }
    if (this.classA === true) {
      this.usedClass.push('מעבדה א');
      this.checkwithClassA = 'מעבדה א';
    }
    if (this.classB === true) {
      this.usedClass.push('מעבדה ב');
      this.checkwithClassB = 'מעבדה ב';
    }
    if (this.classC === true) {
      this.usedClass.push('מעבדה ג');
      this.checkwithClassC = 'מעבדה ג';
    }
    if (this.classD === true) {
      this.usedClass.push('מעבדה ד');
      this.checkwithClassD = 'מעבדה ד';
    }
    if (this.classE === true) {
      this.usedClass.push('מעבדה ה');
      this.checkwithClassE = 'מעבדה ה';
    }
    this.newUsedDate = {
      start_used: this.lastDate1,
      end_used: this.lastDate2,
      start_usedincludingFree: this.lastDate3,
      end_usedincludingFree: this.lastDate4,
      day: this.day,
      month: this.month,
      year: this.year,
      usedClass: this.usedClass
    };
    for (let i = 0; i < this.used_dates.length; i++) {

      // both inside
      if ((this.lastDate1 >= this.used_dates[i].start_usedincludingFree && this.lastDate1 <= this.used_dates[i].end_usedincludingFree) &&
        (this.lastDate2 >= this.used_dates[i].start_usedincludingFree && this.lastDate2 <= this.used_dates[i].end_usedincludingFree) &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
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
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        return 0;
      }
      // both outside after
      if (this.lastDate1 > this.used_dates[i].end_usedincludingFree && this.lastDate2 > this.used_dates[i].end_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        if ((this.used_dates[i].start_usedincludingFree > this.lastDate1 && this.used_dates[i].start_usedincludingFree < this.lastDate2) ||
          (this.used_dates[i].end_usedincludingFree > this.lastDate1 && this.used_dates[i].end_usedincludingFree < this.lastDate2)) {
          this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
          this.usedClass.length = 0;
          this.checkwithAmnot = null;
          this.checkwithAuditorium = null;
          this.checkwithLobby = null;
          this.checkwithClassA = null;
          this.checkwithClassB = null;
          this.checkwithClassC = null;
          this.checkwithClassD = null;
          this.checkwithClassE = null;
          return 0;
        } else {
          //        console.log('both outside after, but there are no events.. we can add ... and yes added');
        }
      }
      // both outside before
      if (this.lastDate1 < this.used_dates[i].start_usedincludingFree && this.lastDate2 < this.used_dates[i].start_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year
      ) {
        // console.log('both outside before , enabled');
      }
      // both outside , start before ,end after
      if (this.lastDate1 < this.used_dates[i].start_usedincludingFree && this.lastDate2 > this.used_dates[i].end_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        if ((this.used_dates[i].start_usedincludingFree > this.lastDate1 && this.used_dates[i].start_usedincludingFree < this.lastDate2) ||
          (this.used_dates[i].end_usedincludingFree > this.lastDate1 && this.used_dates[i].end_usedincludingFree < this.lastDate2)) {
          this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
          this.usedClass.length = 0;
          this.checkwithAmnot = null;
          this.checkwithAuditorium = null;
          this.checkwithLobby = null;
          this.checkwithClassA = null;
          this.checkwithClassB = null;
          this.checkwithClassC = null;
          this.checkwithClassD = null;
          this.checkwithClassE = null;
          return 0;
        } else {
          // console.log('both outside , start before ,end after , but there are no events.. we can add ... and yes added');
        }
      }
      // both outside , start after ,end before
      if (this.lastDate1 > this.used_dates[i].end_usedincludingFree && this.lastDate2 < this.used_dates[i].start_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        //console.log('both outside , start after ,end before');
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        return 0;
      }
      // start inside , end outside
      if (
        ((this.lastDate1 >= this.used_dates[i].start_usedincludingFree) && (this.lastDate1 < this.used_dates[i].end_usedincludingFree)) &&
        (this.lastDate2 > this.used_dates[i].end_usedincludingFree || this.lastDate2 < this.used_dates[i].start_usedincludingFree) &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
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
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        return 0;
      }
      // start outside , end inside
      if (
        ((this.lastDate2 >= this.used_dates[i].start_usedincludingFree) && (this.lastDate2 <= this.used_dates[i].end_usedincludingFree)) &&
        (this.lastDate1 > this.used_dates[i].end_usedincludingFree || this.lastDate1 < this.used_dates[i].start_usedincludingFree) &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
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
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        return 0;
      }

    }
    /*
    if (this.auditorium === true && (this.endHour - this.startHour <= 3)) {
      this.price = this.price + this.mheron[0].auditoriumminimumprice;
    }
    if (this.auditorium === true && (this.endHour - this.startHour > 3 && this.endHour - this.startHour <= this.mheron[0].kamotshaotbyom)) {
      const tempVar = (this.endHour - this.startHour - 3) * this.mheron[0].odoteriumshaate;
      this.price = this.price + this.mheron[0].auditoriumminimumprice + tempVar;
    }
    if (this.auditorium === true && (this.endHour - this.startHour > this.mheron[0].kamotshaotbyom)) {
      this.price = this.price + this.mheron[0].odoteriumyome;
    }
    if (this.amnot === true) {
      this.price = this.price + this.mheron[0].hederomanot * (this.endHour - this.startHour);
    }
    if (this.lobby === true) {
      this.price = this.price + this.mheron[0].lobby * (this.endHour - this.startHour);
    }
    if (this.classA === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classB === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classC === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classD === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classE === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.personLight === true && this.personSound === true) {
      this.price = this.price + this.mheron[0].hagbaraandteora;
    }
    if (this.personLight === true && this.personSound === false) {
      this.price = this.price + this.mheron[0].teora;
    }
    if (this.personLight === false && this.personSound === true) {
      this.price = this.price + this.mheron[0].hagbara;
    }
    */
    this.newEvent = {
      name: this.eventName,
      auditorium: this.auditorium,
      amnot: this.amnot,
      lobby: this.lobby,
      classA: this.classA,
      classB: this.classB,
      classC: this.classC,
      classD: this.classD,
      classE: this.classE,
      personSound: this.personSound,
      personLight: this.personLight,
      microphones: this.microphones,
      mdonot: this.mdonot,
      chairs: this.chairs,
      tables: this.tables,
      start_time: this.lastDate1,
      end_time: this.lastDate2,
      createdBy: this.user.email,
      createdByName: this.fullUserInfoFromDb.Name,
      start_usedincludingFree: this.lastDate3,
      end_usedincludingFree: this.lastDate4,
      microphonesAmount: this.microphonesAmount,
      mdonotAmount: this.mdonotAmount,
      chairsAmount: this.chairsAmount,
      tablesAmount: this.tablesAmount,
      price: this.price,
      paid: this.paid,
      confirmed: false,
      theDay: this.theDay,
      day: this.day,
      month: this.month,
      year: this.year
    };
    this.es.addUncofirmedEvent(this.newEvent);
    //      this.check.addUsedDates(this.newUsedDate);
    this.fms.show('הוספת האירוע התבטלה , מיד תועבר לדאשבורד', { cssClass: 'warning', timeout: 4000 });
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 4000);
  }





  addEvent() {
    this.theDay = new Date(this.date).getDay();
    if (this.theDay === 6) {
      this.fms.show('לא ניתן לשבץ אירוע ביום שבת', { cssClass: 'danger', timeout: 4000 });
      this.price = 0;
      return 0;
    }
    if (this.auditorium === false && this.amnot === false && this.lobby === false && this.classA === false
      && this.classB === false && this.classC === false && this.classD === false && this.classE === false) {
      this.noRoomChosen = true;
      this.fms.show('לא נבחר שום חדר', { cssClass: 'danger', timeout: 4000 });
      return 0;
    }
    this.year = this.date.substring(0, 4);
    this.month = this.date.substring(5, 7);
    this.day = this.date.substring(8, 10);
    this.startHour = this.startTime.substring(0, 2);
    this.startHour = parseInt(this.startHour, 10);
    this.endHour = this.endTime.substring(0, 2);
    this.endHour = parseInt(this.endHour, 10);
    this.startMinute = this.startTime.substring(3, 5);
    this.startMinute = parseInt(this.startMinute, 10);
    this.endMinute = this.endTime.substring(3, 5);
    this.endMinute = parseInt(this.endMinute, 10);
    this.lastDate1 = new Date(this.year, this.month - 1, this.day, this.startHour, this.startMinute).getTime();
    this.lastDate2 = new Date(this.year, this.month - 1, this.day, this.endHour, this.endMinute).getTime();
    this.lastDate3 = new Date(this.year, this.month - 1, this.day, (this.startHour - 1), (this.startMinute + 1)).getTime();
    this.lastDate4 = new Date(this.year, this.month - 1, this.day, (this.endHour + 1), (this.endMinute - 1)).getTime();
    if (this.startHour > this.endHour) {
      this.fms.show('השעה ההתחלתית לא יכולה להיות אחרי שעת הסיום', { cssClass: 'danger', timeout: 4000 });
      this.price = 0;
      return;
    }
    if (this.endHour - this.startHour < 1) {
      this.fms.show('מינימום הזמנה זה שעה', { cssClass: 'danger', timeout: 4000 });
      this.price = 0;
      return;
    }
    if (this.startHour < 6 || this.startHour > 22) {
      this.fms.show('לא ניתן לקבל הצעה לפי השעות שבחרת. אפשר לקבל הצעה רק אחרי 6 בבוקר , והצעה אחרונה רק עד 10 בלילה', { cssClass: 'danger', timeout: 10000 });
      this.price = 0;
      return;
    }
    if (this.startMinute === 0) {
      this.startMinute = 59;
    } else {
      this.startMinute = this.startMinute - 1;
    }
    if (this.auditorium === true) {
      this.usedClass.push('אודיטוריום');
      this.checkwithAuditorium = 'אודיטוריום';
    }
    if (this.amnot === true) {
      this.usedClass.push('סטודיו');
      this.checkwithAmnot = 'סטודיו';
    }
    if (this.lobby === true) {
      this.usedClass.push('לובי');
      this.checkwithLobby = 'לובי';
    }
    if (this.classA === true) {
      this.usedClass.push('מעבדה א');
      this.checkwithClassA = 'מעבדה א';
    }
    if (this.classB === true) {
      this.usedClass.push('מעבדה ב');
      this.checkwithClassB = 'מעבדה ב';
    }
    if (this.classC === true) {
      this.usedClass.push('מעבדה ג');
      this.checkwithClassC = 'מעבדה ג';
    }
    if (this.classD === true) {
      this.usedClass.push('מעבדה ד');
      this.checkwithClassD = 'מעבדה ד';
    }
    if (this.classE === true) {
      this.usedClass.push('מעבדה ה');
      this.checkwithClassE = 'מעבדה ה';
    }
    this.newUsedDate = {
      start_used: this.lastDate1,
      end_used: this.lastDate2,
      start_usedincludingFree: this.lastDate3,
      end_usedincludingFree: this.lastDate4,
      day: this.day,
      month: this.month,
      year: this.year,
      usedClass: this.usedClass
    };
    for (let i = 0; i < this.used_dates.length; i++) {

      // both inside
      if ((this.lastDate1 >= this.used_dates[i].start_usedincludingFree && this.lastDate1 <= this.used_dates[i].end_usedincludingFree) &&
        (this.lastDate2 >= this.used_dates[i].start_usedincludingFree && this.lastDate2 <= this.used_dates[i].end_usedincludingFree) &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
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
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        this.price = 0;
        return 0;
      }
      // both outside after
      if (this.lastDate1 > this.used_dates[i].end_usedincludingFree && this.lastDate2 > this.used_dates[i].end_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        if ((this.used_dates[i].start_usedincludingFree > this.lastDate1 && this.used_dates[i].start_usedincludingFree < this.lastDate2) ||
          (this.used_dates[i].end_usedincludingFree > this.lastDate1 && this.used_dates[i].end_usedincludingFree < this.lastDate2)) {
          this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
          this.usedClass.length = 0;
          this.checkwithAmnot = null;
          this.checkwithAuditorium = null;
          this.checkwithLobby = null;
          this.checkwithClassA = null;
          this.checkwithClassB = null;
          this.checkwithClassC = null;
          this.checkwithClassD = null;
          this.checkwithClassE = null;
          this.price = 0;
          return 0;
        } else {
          //        console.log('both outside after, but there are no events.. we can add ... and yes added');
        }
      }
      // both outside before
      if (this.lastDate1 < this.used_dates[i].start_usedincludingFree && this.lastDate2 < this.used_dates[i].start_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year
      ) {
        // console.log('both outside before , enabled');
      }
      // both outside , start before ,end after
      if (this.lastDate1 < this.used_dates[i].start_usedincludingFree && this.lastDate2 > this.used_dates[i].end_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        if ((this.used_dates[i].start_usedincludingFree > this.lastDate1 && this.used_dates[i].start_usedincludingFree < this.lastDate2) ||
          (this.used_dates[i].end_usedincludingFree > this.lastDate1 && this.used_dates[i].end_usedincludingFree < this.lastDate2)) {
          this.fms.show('מקום לא פנוי , נא לבחור תאריך אחר', { cssClass: 'danger', timeout: 6000 });
          this.usedClass.length = 0;
          this.checkwithAmnot = null;
          this.checkwithAuditorium = null;
          this.checkwithLobby = null;
          this.checkwithClassA = null;
          this.checkwithClassB = null;
          this.checkwithClassC = null;
          this.checkwithClassD = null;
          this.checkwithClassE = null;
          this.price = 0;
          return 0;
        } else {
          // console.log('both outside , start before ,end after , but there are no events.. we can add ... and yes added');
        }
      }
      // both outside , start after ,end before
      if (this.lastDate1 > this.used_dates[i].end_usedincludingFree && this.lastDate2 < this.used_dates[i].start_usedincludingFree &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
        ((this.used_dates[i].usedClass.includes(this.checkwithAuditorium) && this.checkwithAuditorium === 'אודיטוריום') ||
          (this.used_dates[i].usedClass.includes(this.checkwithLobby) && this.checkwithLobby === 'לובי') ||
          (this.used_dates[i].usedClass.includes(this.checkwithAmnot) && this.checkwithAmnot === 'סטודיו') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassA) && this.checkwithClassA === 'מעבדה א') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassB) && this.checkwithClassB === 'מעבדה ב') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassC) && this.checkwithClassC === 'מעבדה ג') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassD) && this.checkwithClassD === 'מעבדה ד') ||
          (this.used_dates[i].usedClass.includes(this.checkwithClassE) && this.checkwithClassE === 'מעבדה ה'))
      ) {
        //console.log('both outside , start after ,end before');
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        this.price = 0;
        return 0;
      }
      // start inside , end outside
      if (
        ((this.lastDate1 >= this.used_dates[i].start_usedincludingFree) && (this.lastDate1 < this.used_dates[i].end_usedincludingFree)) &&
        (this.lastDate2 > this.used_dates[i].end_usedincludingFree || this.lastDate2 < this.used_dates[i].start_usedincludingFree) &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
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
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        this.price = 0;
        return 0;
      }
      // start outside , end inside
      if (
        ((this.lastDate2 >= this.used_dates[i].start_usedincludingFree) && (this.lastDate2 <= this.used_dates[i].end_usedincludingFree)) &&
        (this.lastDate1 > this.used_dates[i].end_usedincludingFree || this.lastDate1 < this.used_dates[i].start_usedincludingFree) &&
        this.day === this.used_dates[i].day && this.month === this.used_dates[i].month && this.year === this.used_dates[i].year &&
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
        this.usedClass.length = 0;
        this.checkwithAmnot = null;
        this.checkwithAuditorium = null;
        this.checkwithLobby = null;
        this.checkwithClassA = null;
        this.checkwithClassB = null;
        this.checkwithClassC = null;
        this.checkwithClassD = null;
        this.checkwithClassE = null;
        this.price = 0;
        return 0;
      }

    }
    /*
    if (this.auditorium === true && (this.endHour - this.startHour <= 3)) {
      this.price = this.price + this.mheron[0].auditoriumminimumprice;
    }
    if (this.auditorium === true && (this.endHour - this.startHour > 3 && this.endHour - this.startHour <= this.mheron[0].kamotshaotbyom)) {
      const tempVar = (this.endHour - this.startHour - 3) * this.mheron[0].odoteriumshaate;
      this.price = this.price + this.mheron[0].auditoriumminimumprice + tempVar;
    }
    if (this.auditorium === true && (this.endHour - this.startHour > this.mheron[0].kamotshaotbyom)) {
      this.price = this.price + this.mheron[0].odoteriumyome;
    }
    if (this.amnot === true) {
      this.price = this.price + this.mheron[0].hederomanot * (this.endHour - this.startHour);
    }
    if (this.lobby === true) {
      this.price = this.price + this.mheron[0].lobby * (this.endHour - this.startHour);
    }
    if (this.classA === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classB === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classC === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classD === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.classE === true) {
      this.price = this.price + this.mheron[0].hedermavada * (this.endHour - this.startHour);
    }
    if (this.personLight === true && this.personSound === true) {
      this.price = this.price + this.mheron[0].hagbaraandteora;
    }
    if (this.personLight === true && this.personSound === false) {
      this.price = this.price + this.mheron[0].teora;
    }
    if (this.personLight === false && this.personSound === true) {
      this.price = this.price + this.mheron[0].hagbara;
    }
    */

    this.newEvent = {
      name: this.eventName,
      auditorium: this.auditorium,
      amnot: this.amnot,
      lobby: this.lobby,
      classA: this.classA,
      classB: this.classB,
      classC: this.classC,
      classD: this.classD,
      classE: this.classE,
      personSound: this.personSound,
      personLight: this.personLight,
      microphones: this.microphones,
      mdonot: this.mdonot,
      chairs: this.chairs,
      tables: this.tables,
      start_time: this.lastDate1,
      end_time: this.lastDate2,
      createdBy: this.user.email,
      createdByName: this.fullUserInfoFromDb.Name,
      orgName: this.fullUserInfoFromDb.Org,
      start_usedincludingFree: this.lastDate3,
      end_usedincludingFree: this.lastDate4,
      microphonesAmount: this.microphonesAmount,
      mdonotAmount: this.mdonotAmount,
      chairsAmount: this.chairsAmount,
      tablesAmount: this.tablesAmount,
      price: this.price,
      paid: this.paid,
      confirmed: true,
      theDay: this.theDay,
      day: this.day,
      month: this.month,
      year: this.year
    };
    this.es.addEvent(this.newEvent);
    this.check.addUsedDates(this.newUsedDate);
    this.fms.show('הוספת אירוע בהצלחה , מיד תועבר לרשימת האירועים שלך', { cssClass: 'success', timeout: 4000 });
    setTimeout(() => {
      this.router.navigate(['/events']);
    }, 4000);
  }


}

