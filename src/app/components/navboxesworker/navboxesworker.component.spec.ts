import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavboxesworkerComponent } from './navboxesworker.component';

describe('NavboxesworkerComponent', () => {
  let component: NavboxesworkerComponent;
  let fixture: ComponentFixture<NavboxesworkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavboxesworkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavboxesworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
