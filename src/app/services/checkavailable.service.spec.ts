import { TestBed, inject } from '@angular/core/testing';

import { CheckavailableService } from './checkavailable.service';

describe('CheckavailableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckavailableService]
    });
  });

  it('should be created', inject([CheckavailableService], (service: CheckavailableService) => {
    expect(service).toBeTruthy();
  }));
});
