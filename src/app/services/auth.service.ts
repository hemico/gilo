import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private af: AngularFireAuth
  ) { }

  getState() {
    return this.af.authState;
  }

  signOut() {
    return this.af.auth.signOut();
  }

  Login(email, password) {
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }

  Register(email, password) {
    return this.af.auth.createUserWithEmailAndPassword(email, password);
  }

  deleteUser() {
    const user = this.af.auth.currentUser;
    return user.delete();
  }

  updateAccountant() {

  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new auth.FacebookAuthProvider();
      this.af.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.af.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
    });
  }

}
