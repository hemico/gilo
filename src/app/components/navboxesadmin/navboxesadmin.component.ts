import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WhoService } from '../../services/who.service';
import { EventService } from '../../services/event.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navboxesadmin',
  templateUrl: './navboxesadmin.component.html',
  styleUrls: ['./navboxesadmin.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavboxesadminComponent implements OnInit {

  userIsLoggedIn;
  userIsAdmin = false;
  tempResult;
  userEmail;
  events;
  eventsLength;
  pastEvents;
  futureEvents;
  pastEventsLength;
  futureEventsLength;
  nextEvent;
  previousEvent;
  msg;
  todaysDate = new Date().getTime();
  unConfirmedUsers;
  ConfirmedUsers;


  single = [
    {
      'name': 'עתדיים',
      'value': 0
    },
    {
      'name': 'הסתיימו',
      'value': 0
    },
  ];
  single2 = [
    {
      'name': 'שולם',
      'value': 0
    },
    {
      'name': 'לא שולם',
      'value': 0
    },
  ];
  single3 = [
    {
      'name': 'בוטלו על ידי הלקוח / מנהל',
      'value': 0
    },
    {
      'name': 'לא אושרו על ידי הלקוח בעת יצירת אירוע',
      'value': 0
    },
  ];
  single4 = [
    {
      'name': 'מאושרים',
      'value': 0
    },
    {
      'name': 'לא מאושרים',
      'value': 0
    },
  ];
  view: any[] = [450, 450];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', 'red', 'blue', '#5AA454', '#A10A28']
  };

  showcharts = null;




  constructor(
    private as: AuthService,
    private who: WhoService,
    private es: EventService,
    private ms: MessageService,
    private us: UserService,
    private fms: FlashMessagesService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.getMsg();
    this.getUnconfirmedUsers();
    this.getConfirmedUsers();
    this.getDeletedEvents();
    this.getUnconfirmedEvents();
    const month = 1; // January
    const d = new Date(2018, month + 1, 0);
    console.log(d);
    const x = new Date(d).getTime();
    console.log(d);
    console.log(x);

    setTimeout(() => {
      this.showcharts = true;
    }, 2000);

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
          this.getEvents();
        } else {
          return 0;
        }
      });
  }

  getEvents() {
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
        this.eventsLength = this.events.length;
        this.pastEvents = this.events.filter(x => x.start_timeOLD <= this.todaysDate);
        this.futureEvents = this.events.filter(x => x.start_timeOLD > this.todaysDate);
        console.log(this.events);
        console.log(this.pastEvents);
        console.log(this.futureEvents);
        this.single[0].value = this.futureEvents.length;
        this.single[1].value = this.pastEvents.length;
        let Paid = 0;
        let unPaid = 0;
        for (let i = 0; i < this.events.length ; i++) {
          Paid += this.events[i].paid;
          unPaid += this.events[i].price - this.events[i].paid;
        }
        this.single2[0].value = Paid;
        this.single2[1].value = unPaid;
        this.getNextEvent();
        this.getPreviousEvent();
      });
  }

  getDeletedEvents() {
    this.es.getallDeletedEvents()
    .subscribe (data => {
      const deleteEvents = data;
      this.single3[0].value = deleteEvents.length;
    });
  }

  getUnconfirmedEvents() {
    this.es.getallUnconfirmedEvents()
    .subscribe (data => {
      const unconfirmedEvents = data;
      this.single3[1].value = unconfirmedEvents.length;
    });
  }

  getNextEvent() {
    this.nextEvent = this.futureEvents.sort((a, b) => a.start_timeOLD - b.start_timeOLD).shift();
  }

  getPreviousEvent() {
    this.previousEvent = this.pastEvents.sort((a, b) => b.start_timeOLD - a.start_timeOLD).shift();
  }

  getMsg() {
    this.ms.getMsg()
      .subscribe(data => {
        this.msg = data[0];
      });
  }

  getUnconfirmedUsers() {
    this.us.getUnconfirmedUsers()
      .subscribe(data => {
        this.unConfirmedUsers = data;
        this.single4[1].value = this.unConfirmedUsers.length;
      });
  }

  getConfirmedUsers() {
    this.us.getconfirmedUsers()
      .subscribe(data => {
        this.ConfirmedUsers = data;
        this.single4[0].value = this.ConfirmedUsers.length;
      });
  }

  approveUser(unConfirmedUser) {
    unConfirmedUser.Confirmed = true;
    this.us.approveUser(unConfirmedUser.id, unConfirmedUser)
      .then(() => {
        this.fms.show(' לקוח ' + unConfirmedUser.Name + ' מארגון ' + unConfirmedUser.Org + ' אושר בהצלחה ', { cssClass: 'success', timeout: 5000 });
      });
  }

}
