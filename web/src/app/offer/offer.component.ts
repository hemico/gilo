import { Component, OnInit } from '@angular/core';
import { Hero }    from '../hero';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {

  partners = ['עד 30', '30-100',
    '101-250', 'מעל 250'];

  model = new Hero(18, '','','','','','','','','','');

  submitted = false;

  onSubmit() { this.submitted = true; }

  newHero() {
    this.model = new Hero(42, '', '','','','','','','',);
  }
}
