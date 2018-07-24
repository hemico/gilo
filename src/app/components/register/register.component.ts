import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrgService } from '../../services/org.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {

  organizations;
  newUser = {
    Name: '',
    Email: '',
    Phone: null,
    Mobile: '',
    password: '',
    Org: '',
    Confirmed: false
  };

  constructor(
    private os: OrgService,
    private as: AuthService,
    private us: UserService,
    private fms: FlashMessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getOrganizations();
  }


  getOrganizations() {
    this.os.getOrganizations()
      .subscribe(data => {
        this.organizations = data;
        console.log(this.organizations);
      });
  }

  onChange(value) {
  this.newUser.Org = value;
  }

  Register() {
    this.as.Register(this.newUser.Email , this.newUser.password)
    .then( () => {
      this.fms.show( ' נרשמת בהצלחה ! מיד תועבר לדאשבורד שלך ' , { cssClass: 'success' , timeout: 4000});
    })
    .then( () => {
      this.us.addUserToDatabase(this.newUser);
    })
    .then( () => {
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 4000);
    })
    .catch( (err) => {
      this.fms.show(err , { cssClass: 'danger' , timeout: 4000});
    } );
  }
}
