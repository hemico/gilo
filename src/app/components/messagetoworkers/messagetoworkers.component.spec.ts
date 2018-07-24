import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagetoworkersComponent } from './messagetoworkers.component';

describe('MessagetoworkersComponent', () => {
  let component: MessagetoworkersComponent;
  let fixture: ComponentFixture<MessagetoworkersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagetoworkersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagetoworkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
