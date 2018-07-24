import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {


  tempResult;
  userEmail;
  x;
  navigateTo;
  constructor(
    public as: AuthService,
    private route: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.as.getState()
      .subscribe((data) => {
        if (data !== null) {
          this.navigateTo = next.routeConfig.path;
          return (this.x = true, this.route.navigate([this.navigateTo]));
        } else {
          return (this.x = false, this.route.navigate(['/login']));
        }
      });
    return this.x;
  }
}
