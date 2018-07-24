import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MheronComponent } from './mheron.component';

describe('MheronComponent', () => {
  let component: MheronComponent;
  let fixture: ComponentFixture<MheronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MheronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MheronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
