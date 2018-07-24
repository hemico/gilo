import { TestBed, inject } from '@angular/core/testing';

import { MheronService } from './mheron.service';

describe('MheronService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MheronService]
    });
  });

  it('should be created', inject([MheronService], (service: MheronService) => {
    expect(service).toBeTruthy();
  }));
});
