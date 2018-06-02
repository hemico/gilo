import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { environment } from './../environments/environment';
import {HttpModule} from "@angular/http";
//Fire Base

import { NavigationComponent } from './navigation/navigation.component';
import { UsersComponent } from './users/users.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { OfferComponent } from './offer/offer.component';
import { ActivityComponent } from './activity/activity.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
//import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthService } from './services/auth.service';
import { FormsModule }   from '@angular/forms';
import {UsersService} from "./services/users.service";
import {AngularFireDatabaseModule} from "angularfire2/database-deprecated";
import {AngularFireModule} from "angularfire2";

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    UsersComponent,
    NotFoundComponent,
    DashboardComponent,
    SignUpComponent,
    SignInComponent,
    OfferComponent,
    ActivityComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'gilo-app'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
  //  AngularFireStorageModule,
    HttpModule,
    RouterModule.forRoot([
      {path: '', component: HomePageComponent},
      {path: 'users', component: UsersComponent},
      {path: 'activity', component: ActivityComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'offer', component: OfferComponent},
      {path: 'sign-in', component: SignInComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: '**', component: NotFoundComponent}
    ])

  ],
  providers: [AuthService,UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
