import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messagetoworkers',
  templateUrl: './messagetoworkers.component.html',
  styleUrls: ['./messagetoworkers.component.css']
})
export class MessagetoworkersComponent implements OnInit {

  msg;

  constructor(
    private msgService: MessageService,
    private fms: FlashMessagesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getMsg();
  }

  getMsg() {
    this.msgService.getMsg()
      .subscribe(data => {
        this.msg = data[0];
      });
  }

  updateMsg() {
    this.msgService.updateMsg(this.msg.id, this.msg)
      .then(() => {
        this.fms.show('ההודעה עודכנה בהצלחה', { cssClass: 'success', timeout: 2500 });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2500);
      });
  }

}
