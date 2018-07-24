import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavboxesclientComponent } from './navboxesclient.component';

describe('NavboxesclientComponent', () => {
  let component: NavboxesclientComponent;
  let fixture: ComponentFixture<NavboxesclientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavboxesclientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavboxesclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
