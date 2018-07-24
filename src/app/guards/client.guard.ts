import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { WhoService } from '../services/who.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {

  tempResult;
  userEmail;
  x;
  navigateTo;
  constructor(
    public as: AuthService,
    public afs: AngularFirestore,
    private who: WhoService,
    private route: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.as.getState()
      .subscribe((data) => {
        if (data !== null) {
          this.userEmail = data.email;
          this.who.getUsers()
            .subscribe(data2 => {
              this.tempResult = data2;
              this.tempResult = this.tempResult.filter(x => x.Email === this.userEmail);
              if (this.tempResult.length > 0) {
                this.navigateTo = next.routeConfig.path;
                return (this.x = true, this.route.navigate([this.navigateTo]));
              } else {
                return (this.x = false, this.route.navigate(['/dashboard']));
              }
            });
        } else {
          return (this.x = false, this.route.navigate(['/login']));
        }
      });
    return this.x;
  }
}

