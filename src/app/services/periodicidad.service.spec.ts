import { TestBed } from '@angular/core/testing';

import { PeriodicidadService } from './periodicidad.service';

describe('PeriodicidadService', () => {
  let service: PeriodicidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodicidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
