import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import {EventService} from '../../services/event.service';
import {Observable} from 'rxjs/index';
import { map } from 'rxjs/operators';

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

interface Request {
  id: number;
  name: string;
  start_timeOLD: number;
  // release_date: string;
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

  constructor(private es: EventService) {
  }

  events$: Observable<Array<CalendarEvent<{ event: Request }>>>;
  clickedDate: Date;
  activeDayIsOpen: boolean = false;


  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    this.events$ = this.es.getallEventsPipe()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
            return {
              title: data.name,
              start: data.start_timeOLD,
              // color: colors.yellow,
              meta: {
                data
              }
      );
  }

  dayClicked({
               date,
               events
             }: {
    date: Date;
    events: Array<CalendarEvent<{ event }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
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
    // window.open(
    //   `https://www.themoviedb.org/movie/${event.meta.film.id}`,
    //   '_blank'
    // );
  }
}
