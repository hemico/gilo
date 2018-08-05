import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit} from '@angular/core';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs/index';
import {WhoService} from '../../services/who.service';
import {AuthService} from '../../services/auth.service';
import {MaterializeAction} from 'angular2-materialize';
import {isToday, format} from 'date-fns';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  user: object = null;
  userIsLoggedIn: boolean;
  userEmail: string;
  today: string = format(Date.now(), 'DD/MM/YYYY');

  constructor(private es: EventService, private as: AuthService, private who: WhoService, private cdr: ChangeDetectorRef) {
  }

  modalActions = new EventEmitter<string | MaterializeAction>();
  tasks: Array<any>;

  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData(): Promise<any> {
    this.tasks = [];
    const {email} = await this.getUser();
    if (await this.isWorker(email)) {
      this.getWorkerTasks();
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

  async isWorker(email): Promise<boolean> {
    const users = await  this.promisifyObservable(this.who.getWorkers());
    return !!users.find(u => u.Email === email);
  }

  async getWorker(email): Promise<any> {
    const users = await  this.promisifyObservable(this.who.getWorkers());
    return users.find(u => u.Email === email);
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


  getWorkerTasks() {
    this.es.getallEvents()
      .subscribe(res => {
        const todayEvents = res.filter((data: any) => isToday(data.start_time));
        this.tasks = [];
        todayEvents.forEach((event: any) => {
          const usedClasses = this.getClassObject(event);
          console.log(event);
          usedClasses.forEach(used => {
            this.tasks.push('פתח ' + used.name + ' בשעה ' + format(event.start_time, 'HH:mm'));
          });
          if (event.chairs) {
            this.tasks.push('הכן ' + event.chairsAmount + ' כסאות ' );
          }
          if (event.tables) {
            this.tasks.push('הכן ' + event.tablesAmount + ' שולחות ' );
          }
          if (event.microphones) {
            this.tasks.push('הכן ' + event.microphonesAmount + ' מיקופונים ' );
          }
          if (event.mdonot) {
            this.tasks.push('הכן ' + event.mdonotAmount + ' מיחמים ' );
          }
          if (event.personLight) {
            this.tasks.push('ודא שיש איש תאורה');
          }
          if (event.personSound) {
            this.tasks.push('ודא שיש איש סאונד');
          }
          usedClasses.forEach(used => {
            this.tasks.push('סגור ' + used.name + ' בשעה ' + format(event.end_time, 'HH:mm')) ;
          });


        });
        console.log(this.tasks);
        this.cdr.detectChanges();
      });
  }

}
