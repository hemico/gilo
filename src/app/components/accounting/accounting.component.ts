import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountingService } from '../../services/accounting.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountingComponent implements OnInit {

  accountant;
  userisAdmin = true;

  constructor(
    private as: AccountingService,
    private fms: FlashMessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAccountant();
  }

  getAccountant() {
    this.as.getAccountant()
      .subscribe(data => {
        this.accountant = data[0];
      });
  }

  updateAccountant() {
    this.as.updateAccountant(this.accountant.id, this.accountant).then(() => {
      this.fms.show('פרטי הגזבר עודכנו בהצלחה', { cssClass: 'success', timeout: 3500 });
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 3500);
    });
  }

}
