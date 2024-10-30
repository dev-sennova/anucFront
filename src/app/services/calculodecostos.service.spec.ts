import { TestBed } from '@angular/core/testing';

import { CalculodecostosService } from './calculodecostos.service';

describe('CalculodecostosService', () => {
  let service: CalculodecostosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculodecostosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
