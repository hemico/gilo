import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { WhoService } from '../../services/who.service';
import { EventService } from '../../services/event.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navboxesclient',
  templateUrl: './navboxesclient.component.html',
  styleUrls: ['./navboxesclient.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NavboxesclientComponent implements OnInit {


  userIsLoggedIn;
  tempResult;
  userEmail;
  user;
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
  eventsByOrg;
  eventsByOrgLength;
  pasteventsByOrg;
  futureeventsByOrg;
  pasteventsByOrgLength;
  futureeventsByOrgLength;

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
      'value': 0,
    },
    {
      'name': 'לא שולם',
      'value': 0,
    },
  ];
  single3 = [
    {
      'name': 'עתדיים',
      'value': 0,
    },
    {
      'name': 'הסתיימו',
      'value': 0,
    },
  ];
  single4 = [
    {
      'name': 'שולם',
      'value': 0,
    },
    {
      'name': 'לא שולם',
      'value': 0,
    },
  ];
  view: any[] = [450, 450];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', 'red', 'blue', '#5AA454', '#A10A28']
  };

  showcharts = null;
  eventSentBackToClient;



  constructor(
    private as: AuthService,
    private who: WhoService,
    private es: EventService,
    private ms: MessageService,
    private us: UserService,
    private fms: FlashMessagesService,
  ) { }

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

  ngOnInit() {
    this.getUser();
    this.getMsg();

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
          this.EventsbyUser();
          this.getUserByEmail();
        } else {
          this.userIsLoggedIn = false;
          this.userEmail = null;
        }
      });
  }

  getUserByEmail() {
    this.us.getUserByEmail(this.userEmail)
      .subscribe(data => {
        this.user = data[0];
        this.EventsbyOrg(this.user.Org);
        this.getClientEventsSentBack();
      });
  }

  EventsbyOrg(userx) {
    this.es.getEventsByOrganization(userx)
      .subscribe(data2 => {
        this.eventsByOrg = data2;
        for (let x = 0; x < this.eventsByOrg.length; x++) {
          const start_timeOLD = this.eventsByOrg[x].start_time;
          const end_timeOLD = this.eventsByOrg[x].end_time;
          const start_time = new Date(this.eventsByOrg[x].start_time);
          const end_time = new Date(this.eventsByOrg[x].end_time);
          const start_usedincludingFree = new Date(this.eventsByOrg[x].start_usedincludingFree);
          const end_usedincludingFree = new Date(this.eventsByOrg[x].end_usedincludingFree);
          this.eventsByOrg[x].start_timeOLD = start_timeOLD;
          this.eventsByOrg[x].end_timeOLD = end_timeOLD;
          this.eventsByOrg[x].start_time = start_time.toLocaleString();
          this.eventsByOrg[x].end_time = end_time.toLocaleString();
          this.eventsByOrg[x].start_usedincludingFree = start_usedincludingFree.toLocaleString();
          this.eventsByOrg[x].end_usedincludingFree = end_usedincludingFree.toLocaleString();
        }
        this.eventsByOrgLength = this.eventsByOrg.length;
        this.pasteventsByOrg = this.eventsByOrg.filter(x => x.start_timeOLD <= this.todaysDate);
        this.futureeventsByOrg = this.eventsByOrg.filter(x => x.start_timeOLD > this.todaysDate);
        this.pasteventsByOrgLength = this.pasteventsByOrg.length;
        this.futureeventsByOrgLength = this.futureeventsByOrg.length;
        this.single3[0].value = this.futureeventsByOrgLength;
        this.single3[1].value = this.pasteventsByOrgLength;
        let Paid = 0;
        let unPaid = 0;
        for (let i = 0; i < this.eventsByOrg.length ; i++) {
          Paid += this.eventsByOrg[i].paid;
          unPaid += this.eventsByOrg[i].price - this.eventsByOrg[i].paid;
        }
        this.single4[0].value = Paid;
        this.single4[1].value = unPaid;
      });
  }

  EventsbyUser() {
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
        this.eventsLength = this.events.length;
        this.pastEvents = this.events.filter(x => x.start_timeOLD <= this.todaysDate);
        this.futureEvents = this.events.filter(x => x.start_timeOLD > this.todaysDate);
        this.pastEventsLength = this.pastEvents.length;
        this.futureEventsLength = this.futureEvents.length;
        this.single[0].value = this.futureEvents.length;
        this.single[1].value = this.pastEvents.length;
        let Paid = 0;
        let unPaid = 0;
        for (let i = 0; i < this.events.length; i++) {
          Paid += this.events[i].paid;
          unPaid += this.events[i].price - this.events[i].paid;
        }
        this.single2[0].value = Paid;
        this.single2[1].value = unPaid;
        this.getNextEvent();
        this.getPreviousEvent();
      });
  }

  getNextEvent() {
    this.nextEvent = this.futureEvents.sort((a, b) => a.start_timeOLD - b.start_timeOLD).shift();
  }

  getPreviousEvent() {
    this.previousEvent = this.pastEvents.sort((a, b) => b.start_timeOLD - a.start_timeOLD).shift();
  }

  getMsg() {
    this.ms.getClientMsg()
      .subscribe(data => {
        this.msg = data[0];
      });
  }


}
