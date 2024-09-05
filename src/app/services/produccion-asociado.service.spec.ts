import { TestBed } from '@angular/core/testing';

import { ProduccionAsociadoService } from './produccion-asociado.service';

describe('ProduccionAsociadoService', () => {
  let service: ProduccionAsociadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduccionAsociadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
