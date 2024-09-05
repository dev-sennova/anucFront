import { TestBed } from '@angular/core/testing';

import { OfertasAsociadoService } from './ofertas-asociado.service';

describe('OfertasAsociadoService', () => {
  let service: OfertasAsociadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfertasAsociadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
