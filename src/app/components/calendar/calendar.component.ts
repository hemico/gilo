import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, NgZone, OnInit} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent} from 'angular-calendar';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs/index';

import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import {WhoService} from '../../services/who.service';
import {AuthService} from '../../services/auth.service';
import {WeekDay} from '@angular/common';
import {MaterializeAction} from 'angular2-materialize';
import {CustomDateFormatter} from './custome-date-formatter.provider';

interface Request {
  id: number;
  name: string;
  start_time: number;
  start_timeOLD: number;
  end_time: number;
  createdBy: string;
  theDay: number;
  disableLink: boolean;

}


@Component({
  selector: 'app-mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {
  view: string = 'month';
  viewDate: Date = new Date();
  user: any = null;
  userIsLoggedIn: boolean;
  userEmail: string;
  tempEvent: any;
  locale: string = 'he';

  constructor(private es: EventService, private as: AuthService, private who: WhoService, private _ngZone: NgZone, private cdr: ChangeDetectorRef) {
  }

  modalActions = new EventEmitter<string | MaterializeAction>();
  events$: Array<any>;
  clickedDate: Date;
  activeDayIsOpen: boolean = false;


  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData(): Promise<any> {
    this.events$ = [];
    const {email} = await this.getUser();
    const role = await this.getUserRole(email);
    switch (role) {
      case 1: // admin
        this.getAdminEvents();
        break;
      case 2: // worker
        const worker = await this.getWorker(email);
        this.getWorkerEvents(worker);
        break;
      case 3: // client
        this.getClientEvents();
        break;
      case 0: // none
      default:
        this.getAnonimizedEvents();
    }
  }

  async getUser(): Promise<any> {
    if (!this.user) {
      this.user = await this.promisifyObservable(this.as.getState());
    }
    return this.user;
  }

  promisifyObservable(o: Observable<any>): Promise<any> {
    return new Promise((resolve) => {
      return o.subscribe(data => {
        resolve(data);
      });
    });
  }

  async getUserRole(email): Promise<number> {
    if (!email) {
      return 0;
    }
    if (await this.isAdmin(email)) {
      return 1;
    }
    if (await this.isWorker(email)) {
      return 2;
    }
    if (await this.isClient(email)) {
      return 3;
    }
    return 4;
  }

  async isAdmin(email): Promise<boolean> {
    const users = await this.promisifyObservable(this.who.getAdmin());
    return !!users.find(u => u.Email === email);
  }

  async isWorker(email): Promise<boolean> {
    const users = await  this.promisifyObservable(this.who.getWorkers());
    return !!users.find(u => u.Email === email);
  }

  async getWorker(email): Promise<any> {
    const users = await  this.promisifyObservable(this.who.getWorkers());
    return users.find(u => u.Email === email);
  }

  async isClient(email): Promise<boolean> {
    const users = await this.promisifyObservable(this.who.getUsers());
    return !!users.find(u => u.Email === email);
  }

  // getUser() {
  //   this.as.getState()
  //     .subscribe((data: any) => {
  //       if (data !== null) {
  //         console.log(data);
  //         this.userIsLoggedIn = true;
  //         this.userEmail = data.email;
  //         this.getAdmin();
  //       } else {
  //         this.userIsLoggedIn = false;
  //         this.userEmail = null;
  //       }
  //     });
  // }

  getEvent(request: Request, anonimize: boolean): any {
    if (request && request.start_timeOLD) {
      return {
        title: anonimize ? 'תפוס' : request.name,
        start: new Date(request.start_timeOLD || 0),
        // color: colors.yellow,
        meta: {
          event: request
        }
      };
    } else {
      return null;
    }
  }

  getClassObject(x) {
    const usedClass = [];
    if (x) {
      if (x.auditorium) {
        usedClass.push({name: 'אודיטוריום', primary: '#1974D2', secondary: '#1974D2'});
      }
      if (x.amnot) {
        usedClass.push({name: 'סטודיו', primary: '#551B8C', secondary: '#551B8C'});
      }
      if (x.lobby) {
        usedClass.push({name: 'לובי', primary: '#00FFFF', secondary: '#00FFFF'});
      }
      if (x.classA) {
        usedClass.push({name: 'מעבדה א', primary: '#008000', secondary: '#008000'});
      }
      if (x.classB) {
        usedClass.push({name: 'מעבדה ב', primary: '#FCFFA4', secondary: '#FCFFA4'});
      }
      if (x.classC) {
        usedClass.push({name: 'מעבדה ג', primary: '#FF0800', secondary: '#FF0800'});
      }
      if (x.classD) {
        usedClass.push({name: 'מעבדה ד', primary: '#ED872D', secondary: '#ED872D'});
      }
      if (x.classE) {
        usedClass.push({name: 'מעבדה ה', primary: '#964B00', secondary: '#964B00'});
      }
    }
    if (usedClass.length === 0) {
      usedClass.push({primary: '#aaaaaa', secondary: '#aaaaaa'});
    }
    return usedClass;
  }

  getClassColor(x) {
    const classObj = this.getClassObject(x)[0];
    return {primary: classObj.primary, secondary: classObj.secondary}
  }

  getClassName(x) {
    return this.getClassObject(x).map(c => c.name).join(', ');
  }


  getTitle(data, anonimize) {
    return this.getClassName(data) + ' - ' + (anonimize ? 'תפוס' : data.name);
  }

  getAdminEvents() {
    this.es.getallEvents()
      .subscribe(res => {
        this.events$ = res.map((data:any) => {
          return {
            title: this.getTitle(data, false),
            start: new Date(data.start_time),
            color: this.getClassColor(data),
            meta: {
              event: data
            }
          };
        });
        this.cdr.detectChanges();
      });
  }

  getAnonimizedEvents() {
    this.es.getallEvents()
      .subscribe(res => {
        this.events$ = res.map((data:any) => {
          return {
            title: this.getTitle(data, true),
            start: new Date(data.start_time),
            color: this.getClassColor(data),
            meta: {
              event: {...data, disableLink: true}
            }
          };
        });
        this.cdr.detectChanges();
      });
  }

  getWorkerEvents(worker) {
    this.es.getallEvents()
      .subscribe(res => {
        this.events$ = res.filter((data:any) => {
          return data.theDay === WeekDay.Sunday && worker.Sunday
            || data.theDay === WeekDay.Monday && worker.Monday
            || data.theDay === WeekDay.Tuesday && worker.Tuesday
            || data.theDay === WeekDay.Wednesday && worker.Wednesday
            || data.theDay === WeekDay.Thursday && worker.Thursday
            || data.theDay === WeekDay.Friday && worker.Friday
            || data.theDay === WeekDay.Saturday && worker.Saturday;
        }).map((data:any) => {
          return {
            title: this.getTitle(data, false),
            start: new Date(data.start_time),
            color: this.getClassColor(data),
            meta: {
              event: data
            }
          };
        });
        this.cdr.detectChanges();
      });
  }

  getClientEvents() {
    this.es.getallEvents()
      .subscribe(res => {
        this.events$ = res.map((data:any) => {
          if (data.createdBy === this.user.email) {
            return {
              title: this.getTitle(data, false),
              start: new Date(data.start_time),
              color: this.getClassColor(data),
              meta: {
                event: {...data, disableLink: false}
              }
            };
          } else {
            return {
              title: this.getTitle(data, true),
              start: new Date(data.start_time),
              color: this.getClassColor(null),
              meta: {
                event: {...data, disableLink: true}
              }
            };
          }
        });
        this.cdr.detectChanges();
      });
  }

  dayClicked({
               date,
               events
             }: {
    date: Date;
    events: Array<CalendarEvent<{ event }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)
    ) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event: CalendarEvent<{ event }>): void {
    const request = event.meta.event;
    if (!request.disableLink) {
      this.modalActions.emit({action: 'modal', params: ['open']});
      request.start_time = new Date(request.start_time).toLocaleString();
      request.end_time = new Date(request.end_time).toLocaleString();
      this.tempEvent = request;
    }
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
    this.tempEvent = {name: ''};
  }

}
