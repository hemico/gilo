import {Component, ChangeDetectionStrategy, OnInit, EventEmitter} from '@angular/core';
import {CalendarEvent, CalendarMonthViewDay} from 'angular-calendar';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs/index';
import {map} from 'rxjs/operators';

import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';
import {WhoService} from '../../services/who.service';
import {AuthService} from '../../services/auth.service';
import {WeekDay} from '@angular/common';
import {MaterializeAction} from 'angular2-materialize';

interface Request {
  id: number;
  name: string;
  start_time: number;
}


@Component({
  selector: 'app-mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  view: string = 'month';
  viewDate: Date = new Date();
  user: object = null;

  constructor(private es: EventService, private as: AuthService, private who: WhoService) {
  }

  modalActions = new EventEmitter<string | MaterializeAction>();
  events$: Observable<Array<CalendarEvent<{ event: Request }>>>;
  clickedDate: Date;
  activeDayIsOpen: boolean = false;


  ngOnInit(): void {
    this.getUser();
  }

  // async getUser(): Promise<any> {
  //   if (!this.user) {
  //     this.user = await this.promisifyObservable(this.as.getState());
  //   }
  //   return this.user;
  // }
  //
  // promisifyObservable(o: Observable<any>): Promise<any> {
  //   return new Promise((resolve) => {
  //     return o.subscribe(data => {
  //       resolve(data);
  //     });
  //   });
  // }
  //
  // async getUserRole(): Promise<number> {
  //   const {email} = await this.getUser();
  //   if (!email) {
  //     return 0;
  //   }
  //   if (await this.isAdmin(email)) {
  //     return 1;
  //   }
  //   if (await this.isWorker(email)) {
  //     return 2;
  //   }
  //   if (await this.isClient(email)) {
  //     return 3;
  //   }
  //   return 4;
  // }
  //
  // async isAdmin(email): Promise<boolean> {
  //   const users = await this.promisifyObservable(this.who.getAdmin());
  //   return !!users.find(u => u.Email === email);
  // }
  //
  // async isWorker(email): Promise<boolean> {
  //   const users = await  this.promisifyObservable(this.who.getWorkers());
  //   return !!users.find(u => u.Email === email);
  // }
  //
  // async isClient(email): Promise<boolean> {
  //   const users = await this.promisifyObservable(this.who.getUsers());
  //   return !!users.find(u => u.Email === email);
  // }

  getUser() {
    this.as.getState()
      .subscribe(data => {
        if (data !== null) {
          console.log(data);
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
        if (!!data.find(x => x.Email === this.userEmail)) {
          this.userIsAdmin = true;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = false;
          this.getAdminEvents();
        } else {
          this.getWorker();
        }
      });
  }

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
    return usedClass;
  }

  getClassName(x) {
    return this.getClassObject(x).map(c => c.name).join(', ');
  }


  getTitle(data, anonimize) {
    return this.getClassName(data) + ' - ' + (anonimize ? 'תפוס' : data.name);
  }

  getAdminEvents() {
    this.events$ = this.es.getallEventsPipe()
      .pipe(map(actions => actions.map(a => {
        const data: Request = <Request>a.payload.doc.data();
        return {
          title: this.getTitle(data, false),
          start: new Date(data.start_time),
          color: this.getClassObject(data),
          meta: {
            event: data
          }
        };
      })));
  }

  getAnonimizedEvents() {
    this.events$ = this.es.getallEventsPipe()
      .pipe(map(actions => actions.map(a => {
        const data: Request = <Request>a.payload.doc.data();
        return {
          title: this.getTitle(data, true),
          start: new Date(data.start_time),
          color: this.getClassObject(data)[0],
          meta: {
            event: {...data, disableLink: true}
          }
        };
      })));
  }

  getWorker() {
    this.who.getWorkers()
      .subscribe(data => {
        if (!!data.find(x => x.Email === this.userEmail)) {
          this.userIsAdmin = false;
          this.userIsWorker = true;
          this.userIsGazbar = false;
          this.userIsClient = false;
          const worker = data.find(x => x.Email === this.userEmail);
          this.getWorkerEvents(worker);
        } else {
          this.getClient();
        }
      });
  }

  getWorkerEvents(worker) {
    this.events$ = this.es.getallEventsPipe().pipe(map(actions => actions.map(a => {
      const data: Request = <Request>a.payload.doc.data();
      return data;
    }).filter(data => {
      return data.theDay === WeekDay.Sunday && worker.Sunday
        || data.theDay === WeekDay.Monday && worker.Monday
        || data.theDay === WeekDay.Tuesday && worker.Tuesday
        || data.theDay === WeekDay.Wednesday && worker.Wednesday
        || data.theDay === WeekDay.Thursday && worker.Thursday
        || data.theDay === WeekDay.Friday && worker.Friday
        || data.theDay === WeekDay.Saturday && worker.Saturday;
    }).map(data => {
      return {
        title: this.getTitle(data, false),
        start: new Date(data.start_time),
        color: this.getClassObject(data),
        meta: {
          event: data
        }
      };
    })));
  }

  getClient() {
    this.who.getUsers()
      .subscribe(data => {
        const userData = data.find(x => x.Email === this.userEmail);
        if (userData && userData.Confirmed) {
          this.userIsAdmin = false;
          this.userIsWorker = false;
          this.userIsGazbar = false;
          this.userIsClient = true;
          this.getClientEvents();
        } else {
          this.getAnonimizedEvents();
        }
      });
  }

  getClientEvents() {
    this.events$ = this.es.getallEventsPipe()
      .pipe(map(actions => actions.map(a => {
        const data: Request = <Request>a.payload.doc.data();
        console.log(data.createdBy);
        if (data.createdBy === this.userEmail) {
          return {
            title: this.getTitle(data, false),
            start: new Date(data.start_time),
            color: this.getClassObject(data),
            meta: {
              event: {...data, disableLink: false}
            }
          };
        } else {
          return {
            title: this.getTitle(data, true),
            start: new Date(data.start_time),
            color: {primary: '#aaaaaa', secondary: '#aaaaaa'},
            meta: {
              event: {...data, disableLink: true}
            }
          };
        }
      })));
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
    const event = event.meta.event;
    if (!event.disableLink) {
      this.modalActions.emit({action: 'modal', params: ['open']});
      event.start_time = new Date(event.start_time).toLocaleString();
      event.end_time = new Date(event.end_time).toLocaleString();
      this.tempEvent = event;
    }
  }

  closeModal() {
    this.modalActions.emit({action: 'modal', params: ['close']});
    this.tempEvent = {name: ''};
  }

}
