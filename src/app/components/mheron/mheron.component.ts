import { Component, OnInit } from '@angular/core';
import { MheronService } from '../../services/mheron.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-mheron',
  templateUrl: './mheron.component.html',
  styleUrls: ['./mheron.component.css']
})
export class MheronComponent implements OnInit {

  globmheron;
  mheron = {
    lobby: '',
    hederomanot: '',
    hedermavada: '',
    kamotshaotbyom: '',
    hagbara: '',
    teora: '',
    hagbaraandteora: '',
    odoteriumyome: '',
    odoteriumshaate: '',
    auditoriumminimumprice: '',
  };

  constructor(
    private ms: MheronService,
    private fms: FlashMessagesService
  ) { }

  ngOnInit() {
    this.getMheron();
  }

  getMheron() {
    this.ms.getMheron()
      .subscribe(data => {
        this.globmheron = data;
        console.log(this.globmheron);
        this.mheron.lobby = this.globmheron[0].lobby;
        this.mheron.hederomanot = this.globmheron[0].hederomanot;
        this.mheron.hedermavada = this.globmheron[0].hedermavada;
        this.mheron.kamotshaotbyom = this.globmheron[0].kamotshaotbyom;
        this.mheron.hagbara = this.globmheron[0].hagbara;
        this.mheron.teora = this.globmheron[0].teora;
        this.mheron.hagbaraandteora = this.globmheron[0].hagbaraandteora;
        this.mheron.odoteriumyome = this.globmheron[0].odoteriumyome;
        this.mheron.odoteriumshaate = this.globmheron[0].odoteriumshaate;
        this.mheron.auditoriumminimumprice = this.globmheron[0].auditoriumminimumprice;
        console.log(this.globmheron[0].id);
      });
  }

  updateMheron() {
    this.ms.updateMheron(this.globmheron[0].id, this.mheron)
      .then( () => {
        this.fms.show('updated successfully');
      })
      .catch( () => {
        console.log('we cant update');
      });
  }
}

