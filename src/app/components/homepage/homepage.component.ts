import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomepageComponent implements OnInit {

  slider1 = './assets/Images/slider1.jpg';
  slider2 = './assets/Images/slider2.jpg';
  slider3 = './assets/Images/slider3.jpg';
  slider4 = './assets/Images/slider4.jpg';
  constructor(

  ) { }

  ngOnInit() {

  }


}
