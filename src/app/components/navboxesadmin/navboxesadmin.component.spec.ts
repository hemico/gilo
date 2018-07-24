import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavboxesadminComponent } from './navboxesadmin.component';

describe('NavboxesadminComponent', () => {
  let component: NavboxesadminComponent;
  let fixture: ComponentFixture<NavboxesadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavboxesadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavboxesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
