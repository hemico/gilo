import { TestBed, async, inject } from '@angular/core/testing';

import { ClientconfirmedGuard } from './clientconfirmed.guard';

describe('ClientconfirmedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientconfirmedGuard]
    });
  });

  it('should ...', inject([ClientconfirmedGuard], (guard: ClientconfirmedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
