import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagetoclientsComponent } from './messagetoclients.component';

describe('MessagetoclientsComponent', () => {
  let component: MessagetoclientsComponent;
  let fixture: ComponentFixture<MessagetoclientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagetoclientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagetoclientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
