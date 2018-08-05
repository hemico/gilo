import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WorkersService } from './services/workers.service';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { WorkersComponent } from './components/workers/workers.component';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { MheronComponent } from './components/mheron/mheron.component';
import { CreateeventComponent } from './components/createevent/createevent.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { EventService } from './services/event.service';
import { EventsComponent } from './components/events/events.component';
import { CheckavailableService } from './services/checkavailable.service';
import { Navbar2Component } from './components/navbar2/navbar2.component';
import { MenuComponent } from './components/menu/menu.component';
import { NavboxesclientComponent } from './components/navboxesclient/navboxesclient.component';
import { AccountingComponent } from './components/accounting/accounting.component';
import { AccountingService } from './services/accounting.service';
import { RedirectComponent } from './components/redirect/redirect.component';
import { AdminGuard } from './guards/admin.guard';
import { NavboxesadminComponent } from './components/navboxesadmin/navboxesadmin.component';
import { NavboxesworkerComponent } from './components/navboxesworker/navboxesworker.component';
import { LoginGuard } from './guards/login.guard';
import { ClientGuard } from './guards/client.guard';
import { OrginizationsComponent } from './components/orginizations/orginizations.component';
import { OrgService } from './services/org.service';
import * as env from '../environments/environment.prod';
import { UserService } from './services/user.service';
import { MessagetoworkersComponent } from './components/messagetoworkers/messagetoworkers.component';
import { MessageService } from './services/message.service';
import { MessagetoclientsComponent } from './components/messagetoclients/messagetoclients.component';
import { MaterializeModule } from 'angular2-materialize';
import { CalendarComponent } from './components/calendar/calendar.component';
import { UsersComponent } from './components/users/users.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';
import { CalendarModule } from 'angular-calendar';
import { CalendarHeaderComponent } from './components/calendar/calendar-header.component';
import {ClientconfirmedGuard} from './guards/clientconfirmed.guard';
import localeHe from '@angular/common/locales/he';
import {registerLocaleData} from '@angular/common';
import {TasksComponent} from "./components/tasks/tasks.component";


registerLocaleData(localeHe);


export const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [LoginGuard] },
  { path: 'accounting', component: AccountingComponent, canActivate: [AdminGuard] },
  { path: 'organizations', component: OrginizationsComponent, canActivate: [AdminGuard] },
  { path: 'mheron', component: MheronComponent, canActivate: [AdminGuard] },
  { path: 'events', component: EventsComponent, canActivate: [LoginGuard] },
  { path: 'createevent', component: CreateeventComponent, canActivate: [ClientconfirmedGuard] },
  { path: 'workers', component: WorkersComponent, canActivate: [AdminGuard] },
  { path: 'messageToWorkers', component: MessagetoworkersComponent, canActivate: [AdminGuard] },
  { path: 'messageToClients', component: MessagetoclientsComponent, canActivate: [AdminGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: 'calendar', component: CalendarComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'redirect', component: RedirectComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WorkersComponent,
    HomepageComponent,
    LoginComponent,
    MheronComponent,
    CreateeventComponent,
    EventsComponent,
    DashboardComponent,
    Navbar2Component,
    MenuComponent,
    NavboxesclientComponent,
    AccountingComponent,
    RedirectComponent,
    NavboxesadminComponent,
    NavboxesworkerComponent,
    OrginizationsComponent,
    MessagetoworkersComponent,
    MessagetoclientsComponent,
    CalendarComponent,
    UsersComponent,
    ContactComponent,
    RegisterComponent,
    AboutComponent,
    CalendarHeaderComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(env.firebaseConfig),
    AngularFireAuthModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    AngularFirestoreModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    MaterializeModule,
    NgxChartsModule,
    CalendarModule.forRoot()
  ],
  providers: [
    WorkersService,
    AngularFireAuth,
    FlashMessagesService,
    EventService,
    CheckavailableService,
    AccountingService,
    AdminGuard,
    LoginGuard,
    ClientGuard,
    OrgService,
    UserService,
    MessageService
  ],
  bootstrap: [AppComponent],
  exports: [CalendarHeaderComponent]
})
export class AppModule { }
