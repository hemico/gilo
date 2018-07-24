import { TestBed, inject } from '@angular/core/testing';

import { WhoService } from './who.service';

describe('WhoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhoService]
    });
  });

  it('should be created', inject([WhoService], (service: WhoService) => {
    expect(service).toBeTruthy();
  }));
});
