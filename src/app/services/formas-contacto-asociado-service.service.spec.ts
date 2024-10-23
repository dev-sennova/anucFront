import { TestBed } from '@angular/core/testing';

import { FormasContactoAsociadoServiceService } from './formas-contacto-asociado-service.service';

describe('FormasContactoAsociadoServiceService', () => {
  let service: FormasContactoAsociadoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormasContactoAsociadoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
