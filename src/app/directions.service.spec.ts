import { TestBed, inject } from '@angular/core/testing';

import { DirectionsService } from './directions.service';

describe('DirectionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectionsService]
    });
  });

  it('should be created', inject([DirectionsService], (service: DirectionsService) => {
    expect(service).toBeTruthy();
  }));
});
