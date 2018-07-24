import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrginizationsComponent } from './orginizations.component';

describe('OrginizationsComponent', () => {
  let component: OrginizationsComponent;
  let fixture: ComponentFixture<OrginizationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrginizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrginizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
